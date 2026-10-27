import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { loadOrders, mockTransport, type Order, type Scenario } from './api';
import './style.css';
function App() {
  const [scenario, setScenario] = useState<Scenario>('success');
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [updated, setUpdated] = useState('');
  const [notice, setNotice] = useState('Pronto para consultar.');
  const request = useRef<AbortController | null>(null);
  const generation = useRef(0);
  useEffect(() => () => { generation.current++; request.current?.abort(); }, []);
  async function refresh() {
    request.current?.abort();
    const current = ++generation.current;
    const controller = new AbortController(); request.current = controller;
    setBusy(true); setError(''); setNotice('Consultando pedidos…');
    try {
      const data = await loadOrders(signal => mockTransport(scenario, signal), controller.signal);
      if (current !== generation.current) return;
      setOrders(data); setUpdated(new Date().toLocaleTimeString('pt-BR')); setNotice(`${data.length} pedidos recebidos.`);
    } catch (e) {
      if (current !== generation.current) return;
      setError(e instanceof Error ? e.message : 'Falha inesperada.'); setNotice('Consulta não concluída.');
    } finally { if (current === generation.current) setBusy(false); }
  }
  function cancel() {
    generation.current++; request.current?.abort(); setBusy(false); setError(''); setNotice('Consulta cancelada. Os dados anteriores foram preservados.');
  }
  const money = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  return <div className="shell"><header><a className="brand" href="#main"><span className="mark">M/S</span> Marcos Solutions <small>FRONT-END LAB</small></a><span className="demo">DADOS FICTÍCIOS</span></header>
    <main id="main"><div className="intro"><div><p className="eyebrow">ESTUDO 03 / CONTINUIDADE DA INTERFACE</p><h1>Uma falha não precisa<br/>apagar o contexto.</h1><p className="lead">Consulte pedidos, simule uma interrupção e recupere o fluxo.<br/>Os últimos dados válidos continuam visíveis.</p></div><div className="index">03<span>React + TypeScript</span></div></div>
    <section className="lab" aria-labelledby="lab-title"><div><p className="eyebrow">LABORATÓRIO CONTROLADO</p><h2 id="lab-title">Escolha como o serviço responde</h2><p>Simulação local. Nenhum pedido é enviado a uma API real.</p></div><label>Cenário<select value={scenario} onChange={e => setScenario(e.target.value as Scenario)} disabled={busy}><option value="success">Sucesso · 650 ms</option><option value="error">Serviço indisponível · HTTP 503</option><option value="slow">Resposta lenta · excede 2,5 s</option><option value="empty">Nenhum pedido</option><option value="invalid">Formato inválido</option></select></label></section>
    <section className="panel" aria-labelledby="orders-title"><div className="panel-head"><div><p className="eyebrow">ACOMPANHAMENTO</p><h2 id="orders-title">Pedidos recentes</h2></div><div className="actions"><button onClick={refresh} disabled={busy}>{busy ? 'Consultando…' : 'Atualizar pedidos'}</button>{busy && <button className="secondary" onClick={cancel}>Cancelar consulta</button>}</div></div>
    <p role="status" className="status">{notice}</p>
    {error && <div role="alert" className="error"><div><strong>{error}</strong><p>{orders !== null ? 'Exibindo a última consulta válida. Estes dados podem estar desatualizados.' : 'Nenhum dado foi carregado. Você pode tentar novamente.'}</p></div><button className="secondary" onClick={refresh}>Tentar novamente</button></div>}
    <div aria-busy={busy}>
    {orders === null ? <div className="empty"><span aria-hidden="true">↗</span><h3>Comece pela primeira consulta</h3><p>Use “Atualizar pedidos” para carregar a base demonstrativa.</p></div> : orders.length === 0 ? <div className="empty"><h3>Nenhum pedido encontrado</h3><p>O serviço respondeu corretamente, mas a lista está vazia.</p></div> : <><div className="summary"><span><b>{orders.length.toString().padStart(2,'0')}</b> pedidos na última consulta</span><span><b>{money(orders.reduce((sum, o) => sum + o.total, 0))}</b> valor demonstrativo</span></div><div className="table-wrap" tabIndex={0} role="region" aria-label="Pedidos, tabela com rolagem horizontal"><table><caption className="sr-only">Pedidos fictícios da última consulta válida</caption><thead><tr><th scope="col">Pedido</th><th scope="col">Cliente fictício</th><th scope="col">Situação</th><th scope="col">Valor</th></tr></thead><tbody>{orders.map(o => <tr key={o.id}><th scope="row">{o.id}</th><td>{o.customer}</td><td><span className={'badge '+(o.status==='Enviado'?'sent':'')}>{o.status}</span></td><td>{money(o.total)}</td></tr>)}</tbody></table></div></>}
    </div><div className="panel-foot"><span>{updated ? `Última consulta válida: ${updated}` : 'Ainda sem consulta válida'}</span><span>Sem reenvio automático · Tentativa manual</span></div></section>
    <footer><strong>Pedidos Resilientes</strong><span>Estudo de portfólio · Sem transações reais</span></footer></main></div>;
}
createRoot(document.getElementById('root')!).render(<App/>);
