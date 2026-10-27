import { describe, it, expect } from 'vitest';
import { parseOrders, sample, loadOrders, mockTransport } from '../src/api';
const signal = () => new AbortController().signal;
describe('response boundary', () => {
 it('accepts valid orders and an empty result', () => { expect(parseOrders(sample)).toEqual(sample); expect(parseOrders([])).toEqual([]); });
 it.each([-1, NaN, Infinity])('rejects invalid total %s', total => expect(() => parseOrders([{...sample[0], total}])).toThrow());
 it('rejects duplicate identities', () => expect(() => parseOrders([sample[0],sample[0]])).toThrow());
 it('rejects unknown status', () => expect(() => parseOrders([{...sample[0],status:'other'}])).toThrow());
 it('rejects unexpected response structure', () => expect(() => parseOrders({orders:sample})).toThrow());
});
describe('request lifecycle', () => {
 it('loads a valid response', async () => expect(await loadOrders(async()=>Response.json(sample),signal())).toEqual(sample));
 it('classifies HTTP failures', async () => await expect(loadOrders(async()=>new Response('',{status:503}),signal())).rejects.toMatchObject({kind:'http'}));
 it('classifies malformed JSON', async () => await expect(loadOrders(async()=>new Response('{'),signal())).rejects.toMatchObject({kind:'invalid'}));
 it('classifies transport failure', async () => await expect(loadOrders(async()=>{throw new TypeError('offline');},signal())).rejects.toMatchObject({kind:'network'}));
 it('aborts a slow transport at deadline', async () => await expect(loadOrders(s=>mockTransport('slow',s),signal(),15)).rejects.toMatchObject({kind:'timeout'}));
 it('distinguishes user cancellation', async () => {const c=new AbortController(); const p=loadOrders(s=>mockTransport('slow',s),c.signal); c.abort(); await expect(p).rejects.toMatchObject({name:'AbortError'});});
});
