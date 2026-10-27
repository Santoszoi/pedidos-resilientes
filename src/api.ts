export type Order = { id: string; customer: string; total: number; status: 'Separação' | 'Enviado' };
export type Scenario = 'success' | 'error' | 'slow' | 'empty' | 'invalid';
export const sample: Order[] = [
  { id: 'PED-1042', customer: 'Mercado Aurora (fictício)', total: 284.50, status: 'Separação' },
  { id: 'PED-1043', customer: 'Café Horizonte (fictício)', total: 167.90, status: 'Enviado' },
  { id: 'PED-1044', customer: 'Empório do Lago (fictício)', total: 432, status: 'Separação' },
];
export class ApiError extends Error {
  constructor(public kind: 'http' | 'timeout' | 'invalid' | 'network', message: string) { super(message); }
}
export function parseOrders(value: unknown): Order[] {
  if (!Array.isArray(value) || !value.every(o => o && typeof o === 'object' &&
    typeof o.id === 'string' && typeof o.customer === 'string' &&
    typeof o.total === 'number' && Number.isFinite(o.total) && o.total >= 0 &&
    ['Separação', 'Enviado'].includes(o.status)) || new Set(value.map(o => o.id)).size !== value.length)
    throw new ApiError('invalid', 'O serviço retornou dados inesperados.');
  return value;
}
// Local transport simulation. No network request, customer data or credentials.
export function mockTransport(scenario: Scenario, signal: AbortSignal): Promise<Response> {
  return new Promise((resolve, reject) => {
    const abort = () => { clearTimeout(timer); reject(new DOMException('Aborted', 'AbortError')); };
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', abort);
      resolve(new Response(JSON.stringify(scenario === 'empty' ? [] : scenario === 'invalid' ? { unexpected: true } : sample),
        { status: scenario === 'error' ? 503 : 200 }));
    }, scenario === 'slow' ? 5000 : 650);
    if (signal.aborted) abort(); else signal.addEventListener('abort', abort, { once: true });
  });
}
export type Transport = (signal: AbortSignal) => Promise<Response>;
export async function loadOrders(transport: Transport, signal: AbortSignal, timeoutMs = 2500): Promise<Order[]> {
  const controller = new AbortController();
  let timedOut = false;
  const cancel = () => controller.abort();
  signal.addEventListener('abort', cancel, { once: true });
  if (signal.aborted) controller.abort();
  const timer = setTimeout(() => { timedOut = true; controller.abort(); }, timeoutMs);
  try {
    const response = await transport(controller.signal);
    if (!response.ok) throw new ApiError('http', `Serviço indisponível (HTTP ${response.status}).`);
    const payload: unknown = await response.json();
    return parseOrders(payload);
  } catch (error) {
    if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
    if (timedOut) throw new ApiError('timeout', 'O serviço demorou mais que o esperado.');
    if (error instanceof ApiError) throw error;
    if (error instanceof SyntaxError) throw new ApiError('invalid', 'O serviço retornou dados inesperados.');
    throw new ApiError('network', 'Não foi possível consultar o serviço.');
  } finally { clearTimeout(timer); signal.removeEventListener('abort', cancel); }
}
