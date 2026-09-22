-- O backfill de add_enderecos_origem_integracao.sql comparava
-- label = 'Sistema de vendas' com case exato. Endereços sincronizados antes
-- dessa migration com o label "Sistema de Vendas" (V maiúsculo, formato usado
-- em syncs anteriores) ficaram de fora, e a sync seguinte não os reconhecia
-- como já existentes — duplicava de novo. Backfill sem distinguir maiúsculas.
UPDATE enderecos
SET origem_integracao = true
WHERE origem_integracao = false AND active = true AND label ILIKE 'sistema de vendas';
