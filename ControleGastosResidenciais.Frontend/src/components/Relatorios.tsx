import React, { useState, useEffect } from 'react';
import { RelatorioTotaisPessoas, RelatorioTotaisCategorias } from '../types';
import { relatorioService } from '../services/relatorioService';

type TipoRelatorio = 'pessoas' | 'categorias';

const Relatorios: React.FC = () => {
  const [tipoRelatorio, setTipoRelatorio] = useState<TipoRelatorio>('pessoas');
  const [relatoriosPessoas, setRelatoriosPessoas] = useState<RelatorioTotaisPessoas | null>(null);
  const [relatoriosCategorias, setRelatoriosCategorias] = useState<RelatorioTotaisCategorias | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRelatorio = async (tipo: TipoRelatorio) => {
    try {
      setLoading(true);
      setError(null);

      if (tipo === 'pessoas') {
        const data = await relatorioService.getTotaisPorPessoa();
        setRelatoriosPessoas(data);
      } else {
        const data = await relatorioService.getTotaisPorCategoria();
        setRelatoriosCategorias(data);
      }
    } catch (err) {
      setError('Erro ao carregar relatório');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRelatorio(tipoRelatorio);
  }, [tipoRelatorio]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const getClassForValue = (value: number) => {
    return value >= 0 ? 'text-green' : 'text-red';
  };

  if (loading) {
    return <div className="loading">Carregando relatório...</div>;
  }

  return (
    <div>
      <div className="card">
        <h2>Relatórios de Totais</h2>

        {error && <div className="error">{error}</div>}

        <div className="form-group">
          <label htmlFor="tipoRelatorio">Tipo de Relatório:</label>
          <select
            id="tipoRelatorio"
            value={tipoRelatorio}
            onChange={(e) => setTipoRelatorio(e.target.value as TipoRelatorio)}
            style={{ width: '300px' }}
          >
            <option value="pessoas">Totais por Pessoa</option>
            <option value="categorias">Totais por Categoria</option>
          </select>
        </div>
      </div>

      {/* Relatório por Pessoas */}
      {tipoRelatorio === 'pessoas' && relatoriosPessoas && (
        <div className="card">
          <h3>Totais por Pessoa</h3>
          <p>Total de receitas, despesas e saldo de cada pessoa cadastrada.</p>

          {relatoriosPessoas.totaisPorPessoa.length === 0 ? (
            <p>Nenhum dado encontrado.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Pessoa</th>
                  <th>Idade</th>
                  <th>Total Receitas</th>
                  <th>Total Despesas</th>
                  <th>Saldo Líquido</th>
                  <th>Qtd. Transações</th>
                </tr>
              </thead>
              <tbody>
                {relatoriosPessoas.totaisPorPessoa.map((item) => (
                  <tr key={item.pessoaId}>
                    <td><strong>{item.nome}</strong></td>
                    <td>{item.idade}</td>
                    <td className="text-green">{formatCurrency(item.totalReceitas)}</td>
                    <td className="text-red">{formatCurrency(item.totalDespesas)}</td>
                    <td className={getClassForValue(item.saldoLiquido)}>
                      <strong>{formatCurrency(item.saldoLiquido)}</strong>
                    </td>
                    <td>{item.quantidadeTransacoes}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ backgroundColor: '#f8f9fa', fontWeight: 'bold', fontSize: '16px' }}>
                  <td colSpan={2}><strong>TOTAL GERAL</strong></td>
                  <td className="text-green">
                    <strong>{formatCurrency(relatoriosPessoas.totaisGerais.totalReceitas)}</strong>
                  </td>
                  <td className="text-red">
                    <strong>{formatCurrency(relatoriosPessoas.totaisGerais.totalDespesas)}</strong>
                  </td>
                  <td className={getClassForValue(relatoriosPessoas.totaisGerais.saldoLiquido)}>
                    <strong>{formatCurrency(relatoriosPessoas.totaisGerais.saldoLiquido)}</strong>
                  </td>
                  <td><strong>{relatoriosPessoas.totaisGerais.totalTransacoes}</strong></td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      )}

      {/* Relatório por Categorias */}
      {tipoRelatorio === 'categorias' && relatoriosCategorias && (
        <div className="card">
          <h3>Totais por Categoria</h3>
          <p>Total de receitas, despesas e saldo de cada categoria cadastrada.</p>

          {relatoriosCategorias.detalhesPorCategoria.length === 0 ? (
            <p>Nenhum dado encontrado.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Categoria</th>
                  <th>Total Receitas</th>
                  <th>Total Despesas</th>
                  <th>Saldo Líquido</th>
                  <th>Qtd. Transações</th>
                </tr>
              </thead>
              <tbody>
                {relatoriosCategorias.detalhesPorCategoria.map((item) => (
                  <tr key={item.categoriaId}>
                    <td><strong>{item.descricao}</strong></td>
                    <td className="text-green">{formatCurrency(item.totalReceitas)}</td>
                    <td className="text-red">{formatCurrency(item.totalDespesas)}</td>
                    <td className={getClassForValue(item.saldoLiquido)}>
                      <strong>{formatCurrency(item.saldoLiquido)}</strong>
                    </td>
                    <td>{item.quantidadeTransacoes}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ backgroundColor: '#f8f9fa', fontWeight: 'bold', fontSize: '16px' }}>
                  <td><strong>TOTAL GERAL</strong></td>
                  <td className="text-green">
                    <strong>{formatCurrency(relatoriosCategorias.totaisGerais.totalReceitas)}</strong>
                  </td>
                  <td className="text-red">
                    <strong>{formatCurrency(relatoriosCategorias.totaisGerais.totalDespesas)}</strong>
                  </td>
                  <td className={getClassForValue(relatoriosCategorias.totaisGerais.saldoLiquido)}>
                    <strong>{formatCurrency(relatoriosCategorias.totaisGerais.saldoLiquido)}</strong>
                  </td>
                  <td><strong>{relatoriosCategorias.totaisGerais.totalTransacoes}</strong></td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Relatorios;