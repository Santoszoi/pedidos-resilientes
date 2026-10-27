import { test, expect } from '@playwright/test';
test.beforeEach(async({page})=>{await page.goto('/');});
test('keeps previous data on failure and recovers with manual retry',async({page})=>{
 await page.getByRole('button',{name:'Atualizar pedidos'}).click();
 await expect(page.getByRole('row')).toHaveCount(4);
 await page.getByLabel('Cenário').selectOption('error');
 await page.getByRole('button',{name:'Atualizar pedidos'}).click();
 await expect(page.getByRole('alert')).toContainText('HTTP 503');
 await expect(page.getByRole('row')).toHaveCount(4);
 await page.getByLabel('Cenário').selectOption('success');
 await page.getByRole('button',{name:'Tentar novamente'}).click();
 await expect(page.getByRole('status')).toHaveText('3 pedidos recebidos.');
 await expect(page.getByRole('alert')).toHaveCount(0);
});
test('initial failure does not invent data',async({page})=>{
 await page.getByLabel('Cenário').selectOption('error'); await page.getByRole('button',{name:'Atualizar pedidos'}).click();
 await expect(page.getByRole('alert')).toContainText('Nenhum dado foi carregado'); await expect(page.getByRole('table')).toHaveCount(0);
});
test('timeout allows retry',async({page})=>{
 await page.getByLabel('Cenário').selectOption('slow'); await page.getByRole('button',{name:'Atualizar pedidos'}).click();
 await expect(page.getByRole('alert')).toContainText('demorou'); await expect(page.getByRole('button',{name:'Tentar novamente'})).toBeEnabled();
});
test('cancelled request cannot overwrite a later empty response',async({page})=>{
 await page.getByLabel('Cenário').selectOption('slow'); await page.getByRole('button',{name:'Atualizar pedidos'}).click();
 await page.getByRole('button',{name:'Cancelar consulta'}).click();
 await expect(page.getByRole('status')).toContainText('cancelada');
 await page.getByLabel('Cenário').selectOption('empty'); await page.getByRole('button',{name:'Atualizar pedidos'}).click();
 await expect(page.getByRole('heading',{name:'Nenhum pedido encontrado'})).toBeVisible();
 await page.waitForTimeout(5100); await expect(page.getByRole('table')).toHaveCount(0);
});
test('invalid payload produces useful error',async({page})=>{
 await page.getByLabel('Cenário').selectOption('invalid'); await page.getByRole('button',{name:'Atualizar pedidos'}).click(); await expect(page.getByRole('alert')).toContainText('dados inesperados');
});
test('keyboard operates query and mobile page stays within viewport',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); await expect(page.getByLabel('Cenário')).toBeFocused();
 await page.keyboard.press('Tab'); await expect(page.getByRole('button',{name:'Atualizar pedidos'})).toBeFocused();
 await page.keyboard.press('Enter'); await expect(page.getByRole('row')).toHaveCount(4);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});
