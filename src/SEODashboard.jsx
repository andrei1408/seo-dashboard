import React, { useState, useCallback } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts';

// ─── Paleta ───────────────────────────────────────────────────────────────────
const C = {
  bg: '#0b0f1a', surface: '#111827', card: '#161d2e', border: '#1e2d45',
  accent: '#00e5ff', accentDim: '#0a3a4a',
  green: '#22d3a5', red: '#ff4d6d', yellow: '#fbbf24', purple: '#818cf8',
  text: '#e2e8f0', muted: '#64748b',
};
const CAT_COLORS = ['#00e5ff', '#22d3a5', '#818cf8', '#fb923c', '#f472b6', '#34d399', '#a78bfa'];

const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

// ─── Configuração por país ────────────────────────────────────────────────────
const PAISES = {
  MX: {
    id: 'MX', label: 'México', flag: '🇲🇽', idioma: 'espanhol (México)',
    site: 'madesa.mx', cor: '#22c55e',
    categorias: {
      "Muebles de Cocina":  ["cocina","cocina integral","gabinete","gabinetes","vitrina","vitrinas","tarja","fregadero","barra de cocina","despensa","mueble horno","gabinete superior","gabinete bajo","mueble fregadero","muebles de cocina","cocinas integrales","accesorios de cocina","mueble cocina"],
      "Recámara":           ["closet","clóset","ropero","zapatera","zapatero","cajonera","cómoda","tocador","buró","recámara","recamara","guardarropa","armario","accesorios recámara","mueble recámara","closet matrimonial","ropero doble"],
      "Comedor":            ["comedor","mesa comedor","silla","sillas","juego de comedor","mesa de comedor","bufetera","estante comedor","comedores","juego comedor","mesa con sillas","mesa vidrio","mesa madera"],
      "Sala":               ["sala","centro de entretenimiento","panel tv","panel de tv","mesa tv","mueble tv","rack tv","rack sala","mueble para tv","centro entretenimiento","televisión","television"],
      "Oficina y Estudio":  ["escritorio","librero","estante oficina","home office","oficina","estudio","silla oficina","escritorio esquinero","mesa escritorio","librero estante","mueble oficina","escritorio cajones"],
      "Baño":               ["baño","mueble baño","mueble para baño","gabinete baño","armario baño","muebles de baño","vanidad","espejo baño"],
      "Más Ambientes":      ["garaje","lavadero","mueble garaje","mueble lavadero","garage","muebles garaje","muebles lavadero","área de servicio"],
    },
    meses: [
      { id:0,  nome:'Janeiro',   eventos:['Año Nuevo','Reyes Magos (6/Jan)'] },
      { id:1,  nome:'Fevereiro', eventos:['Día del Amor y Amistad (14/Feb)','Fin de semana largo'] },
      { id:2,  nome:'Março',     eventos:['Día de la Mujer (8/Mar)','Mes del Consumidor','Primavera (21/Mar)'] },
      { id:3,  nome:'Abril',     eventos:['Semana Santa','Vacaciones de Pascua'] },
      { id:4,  nome:'Maio',      eventos:['Día del Trabajo (1/Mai)','Día de la Madre (10/Mai)'] },
      { id:5,  nome:'Junho',     eventos:['Día del Padre (Jun)','Fin de cursos'] },
      { id:6,  nome:'Julho',     eventos:['Vacaciones de verano','Hot Sale (Jul)'] },
      { id:7,  nome:'Agosto',    eventos:['Regreso a clases','Back to Office'] },
      { id:8,  nome:'Setembro',  eventos:['Fiestas Patrias (15-16/Set)','Equinoccio de otoño'] },
      { id:9,  nome:'Outubro',   eventos:['Día de Muertos (prep.)','Halloween','Pink October'] },
      { id:10, nome:'Novembro',  eventos:['Día de Muertos (1-2/Nov)','Buen Fin','Black Friday'] },
      { id:11, nome:'Dezembro',  eventos:['Navidad','Año Nuevo (prep.)','Posadas (16-24/Dez)'] },
    ],
  },
  BR: {
    id: 'BR', label: 'Brasil', flag: '🇧🇷', idioma: 'português (Brasil)',
    site: 'madesa.com.br', cor: '#eab308',
    categorias: {
      "Cozinha":            ["cozinha","armário de cozinha","balcão","pia","gabinete de cozinha","vitrô","vitrine","cozinha planejada","módulo de cozinha","cozinha compacta"],
      "Quarto":             ["guarda-roupa","wardrobe","closet","cama","cabeceira","mesa de cabeceira","criado-mudo","quarto","roupeiro","sapateira"],
      "Sala de Jantar":     ["mesa de jantar","cadeira","conjunto de jantar","sala de jantar","mesa redonda","mesa de 6 lugares","mesa com tampo de vidro","mesa de madeira"],
      "Sala de Estar":      ["rack","painel de tv","estante sala","sofá","sala de estar","centro de entretenimento","televisão","tv","painel"],
      "Escritório":         ["escrivaninha","mesa de escritório","cadeira de escritório","home office","estante","livreira","computador","mesa gamer","escritório"],
      "Banheiro":           ["armário de banheiro","gabinete banheiro","espelho banheiro","cuba","pia banheiro","móvel banheiro"],
      "Lavanderia/Garagem": ["armário de lavanderia","estante garagem","organizador","prateleira","lavanderia"],
    },
    meses: [
      { id:0,  nome:'Janeiro',   eventos:['Réveillon','Verão','Liquidações de janeiro'] },
      { id:1,  nome:'Fevereiro', eventos:['Carnaval','Dia dos Namorados (12/Fev — alguns estados)'] },
      { id:2,  nome:'Março',     eventos:['Dia da Mulher (8/Mar)','Início das aulas'] },
      { id:3,  nome:'Abril',     eventos:['Páscoa','Tiradentes (21/Abr)'] },
      { id:4,  nome:'Maio',      eventos:['Dia das Mães (2º domingo)','Dia do Trabalho (1/Mai)'] },
      { id:5,  nome:'Junho',     eventos:['Dia dos Namorados (12/Jun)','Festa Junina'] },
      { id:6,  nome:'Julho',     eventos:['Férias escolares','Inverno'] },
      { id:7,  nome:'Agosto',    eventos:['Dia dos Pais (2º domingo)','Volta às aulas'] },
      { id:8,  nome:'Setembro',  eventos:['Semana Brasil','Independência (7/Set)'] },
      { id:9,  nome:'Outubro',   eventos:['Dia das Crianças (12/Out)','Halloween'] },
      { id:10, nome:'Novembro',  eventos:['Black Friday','Cyber Monday','Proclamação da República (15/Nov)'] },
      { id:11, nome:'Dezembro',  eventos:['Natal','Réveillon (prep.)','Alta temporada de vendas'] },
    ],
  },
  AR: {
    id: 'AR', label: 'Argentina', flag: '🇦🇷', idioma: 'espanhol (Argentina)',
    site: 'madesa.com.ar', cor: '#60a5fa',
    categorias: {
      "Muebles de Cocina":  ["cocina","mueble de cocina","alacena","bajo mesada","mueble bajo","cocina integral","gabinete cocina","estante cocina","mesada"],
      "Dormitorio":         ["placard","ropero","cajonera","cómoda","velador","dormitorio","guardarropa","zapatera","mueble dormitorio"],
      "Comedor":            ["mesa de comedor","sillas","juego de comedor","comedor","mesa rectangular","mesa ratona","buffet","vajillero"],
      "Living":             ["rack tv","módulo tv","living","mueble tv","estante living","biblioteca","panel tv"],
      "Oficina y Estudio":  ["escritorio","silla de oficina","home office","estantería","biblioteca","mueble oficina","escritorio esquinero"],
      "Baño":               ["botiquín","mueble de baño","vanitory","espejo baño","mueble bajo mesada baño"],
      "Otros Ambientes":    ["garaje","lavadero","mueble exterior","organizador"],
    },
    meses: [
      { id:0,  nome:'Janeiro',   eventos:['Verano','Vacaciones de enero','Liquidaciones'] },
      { id:1,  nome:'Fevereiro', eventos:['Verano','Carnaval','Fin de temporada'] },
      { id:2,  nome:'Março',     eventos:['Vuelta al cole','Día de la Mujer (8/Mar)','Otoño'] },
      { id:3,  nome:'Abril',     eventos:['Semana Santa','Feriado largo de Pascua'] },
      { id:4,  nome:'Maio',      eventos:['Día del Trabajador (1/Mai)','25 de Mayo'] },
      { id:5,  nome:'Junho',     eventos:['Día del Padre (3er domingo)','Invierno'] },
      { id:6,  nome:'Julho',     eventos:['Vacaciones de invierno','Día de la Independencia (9/Jul)'] },
      { id:7,  nome:'Agosto',    eventos:['Vuelta al cole (2º semestre)','Fin del invierno'] },
      { id:8,  nome:'Setembro',  eventos:['Primavera (21/Set)','Día del Estudiante (21/Set)'] },
      { id:9,  nome:'Outubro',   eventos:['CyberMonday Argentina','Día de la Madre (3er domingo)'] },
      { id:10, nome:'Novembro',  eventos:['Black Friday','Días de descuentos Banco'] },
      { id:11, nome:'Dezembro',  eventos:['Navidad','Fin de año','Alta temporada de ventas'] },
    ],
  },
};


// ─── Formatos de conteúdo ─────────────────────────────────────────────────────
const CONTENT_FORMATS = [
  { id: 'artigo',  label: 'Artigo',        icon: '📝', desc: 'Blog, guia, comparativo',       color: '#00e5ff', dim: '#0a3a4a', tipos: ['Artigo de Blog','Guia de Compra','Comparativo','FAQ','Conteúdo Sazonal'] },
  { id: 'landing', label: 'Landing Page',  icon: '🖥️', desc: 'Página de conversão',            color: '#22d3a5', dim: '#0a2e25', tipos: ['Landing Page','Página de Categoria','Página Sazonal','Página de Campanha'] },
  { id: 'social',  label: 'Redes Sociais', icon: '📱', desc: 'Instagram, TikTok, Facebook',    color: '#f472b6', dim: '#2d1128', tipos: ['Post Instagram','Carrossel','Reels / TikTok','Story','Post Facebook'] },
];


// ─── Etapas do Funil ─────────────────────────────────────────────────────────
const FUNNEL_STAGES = [
  {
    id: 'topo',
    label: 'Topo de Funil',
    short: 'Topo',
    icon: '🌐',
    desc: 'Consciência · Descoberta',
    color: '#818cf8',
    dim: '#1e1b4b',
    objetivo: 'Atrair visitantes que ainda não conhecem a marca. Conteúdo educativo, inspiracional e de amplo alcance.',
    exemplos: 'Como escolher, dicas de decoração, tendências, guias, comparativos gerais',
    intencao: 'informacional',
  },
  {
    id: 'meio',
    label: 'Meio de Funil',
    short: 'Meio',
    icon: '🎯',
    desc: 'Consideração · Avaliação',
    color: '#fb923c',
    dim: '#2d1600',
    objetivo: 'Nutrir leads que já consideram comprar. Conteúdo que compara, detalha benefícios e responde dúvidas.',
    exemplos: 'Comparativos de produtos, reviews, guias de compra específicos, FAQs detalhadas',
    intencao: 'investigacional',
  },
  {
    id: 'fundo',
    label: 'Fundo de Funil',
    short: 'Fundo',
    icon: '💰',
    desc: 'Conversão · Decisão',
    color: '#22d3a5',
    dim: '#0a2e25',
    objetivo: 'Converter quem está pronto para comprar. Conteúdo com CTA claro, ofertas, provas sociais e urgência.',
    exemplos: 'Landing pages de produto, páginas de oferta, depoimentos, páginas de campanha',
    intencao: 'transacional',
  },
];

// ─── Anthropic API ────────────────────────────────────────────────────────────
async function fetchInsight(categoryName, keywords, selectedMonths, selectedFormats, pais, qtdInsights, selectedFunnel) {
  const top = [...keywords].sort((a, b) => b.impressions - a.impressions).slice(0, 15);
  const paisConfig = PAISES[pais] || PAISES.MX;
  const mesesConfig = paisConfig.meses;

  const mesesInfo = selectedMonths.length > 0
    ? selectedMonths.map(id => { const m = mesesConfig[id]; return m ? `• ${m.nome}: ${m.eventos.join(', ')}` : ''; }).filter(Boolean).join('\n')
    : '(nenhum mês selecionado — sem sazonalidade específica)';

  const formatsAtivos = selectedFormats && selectedFormats.length > 0
    ? CONTENT_FORMATS.filter(f => selectedFormats.includes(f.id))
    : CONTENT_FORMATS;
  const qtd = Math.min(Math.max(qtdInsights || 3, formatsAtivos.length), 10);
  const formatsDesc = formatsAtivos.map(f => `• ${f.label} (id: "${f.id}"): ${f.tipos.join(', ')}`).join('\n');

  const funnelAtivos = selectedFunnel && selectedFunnel.length > 0
    ? FUNNEL_STAGES.filter(s => selectedFunnel.includes(s.id))
    : FUNNEL_STAGES;
  const funnelDesc = funnelAtivos.map(s => `• ${s.label} (id: "${s.id}"): ${s.objetivo} Exemplos: ${s.exemplos}.`).join('\n');

  const prompt = `Você é especialista em SEO e marketing de conteúdo para e-commerce de móveis no mercado de ${paisConfig.label} (site: ${paisConfig.site}).

Categoria: "${categoryName}"
Status: ${keywords.length > 0 && (keywords.reduce((s,k)=>s+k.clicks,0)/keywords.length) > 10 ? 'Cluster saudável' : 'Baixa performance — prioridade de conteúdo'}

Palavras-chave disponíveis (ordenadas por impressões):
${top.map(k => `- "${k.keyword}" | ${k.clicks} cliques | ${k.impressions} impressões | CTR ${k.ctr}% | Posição ${k.position}`).join('\n')}

Sazonalidades de ${paisConfig.label} nos meses selecionados:
${mesesInfo}

Formatos solicitados (distribua ${qtd} sugestões entre os formatos, pelo menos 1 por formato):
${formatsDesc}

Etapas do funil de conteúdo solicitadas:
${funnelDesc}

Para cada sugestão retorne:
- formato_id: id do formato ("artigo", "landing" ou "social")
- tipo: tipo específico dentro daquele formato
- funil_id: etapa do funil ("topo", "meio" ou "fundo") — aloque distribuindo entre as etapas selecionadas
- titulo: título/hook em ${paisConfig.idioma}, alinhado com a intenção da etapa do funil
- motivo: justificativa estratégica em 1 frase, mencionando a etapa do funil
- keyword_principal: a palavra-chave da lista acima que deve ser o foco principal deste conteúdo (use exatamente como aparece na lista)
- melhor_mes: número do mês ideal (0=Jan…11=Dez), ou null

Responda APENAS JSON válido sem markdown:
[{"formato_id":"artigo","tipo":"Artigo de Blog","funil_id":"topo","titulo":"...","motivo":"...","keyword_principal":"...","melhor_mes":null}]`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1200,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await res.json();
    const text = data.content?.map(b => b.text || '').join('') || '[]';
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch {
    return [];
  }
}

// ─── Seletor de País ─────────────────────────────────────────────────────────
const CountrySelector = ({ selected, onChange, qtdInsights, setQtdInsights }) => (
  <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
    <div>
      <p style={{ fontSize:10, color:C.muted, textTransform:'uppercase', letterSpacing:1.2, margin:'0 0 8px', fontWeight:700 }}>País / Mercado</p>
      <div style={{ display:'flex', gap:8 }}>
        {Object.values(PAISES).map(p => {
          const on = selected === p.id;
          return (
            <div key={p.id} onClick={() => onChange(p.id)} style={{
              cursor:'pointer', borderRadius:10, padding:'8px 16px', userSelect:'none',
              background: on ? `${p.cor}22` : C.surface,
              border: `1.5px solid ${on ? p.cor : C.border}`,
              display:'flex', alignItems:'center', gap:8, transition:'all .15s',
            }}>
              <span style={{ fontSize:18 }}>{p.flag}</span>
              <span style={{ fontSize:13, fontWeight:700, color: on ? p.cor : C.text }}>{p.label}</span>
            </div>
          );
        })}
      </div>
    </div>
    <div style={{ marginLeft:'auto' }}>
      <p style={{ fontSize:10, color:C.muted, textTransform:'uppercase', letterSpacing:1.2, margin:'0 0 8px', fontWeight:700 }}>
        Quantidade de insights: <span style={{ color:C.accent }}>{qtdInsights}</span>
      </p>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <span style={{ fontSize:11, color:C.muted }}>3</span>
        <input
          type="range" min={3} max={10} step={1} value={qtdInsights}
          onChange={e => setQtdInsights(+e.target.value)}
          style={{ accentColor:C.accent, width:160, cursor:'pointer' }}
        />
        <span style={{ fontSize:11, color:C.muted }}>10</span>
      </div>
    </div>
  </div>
);

// ─── Seletor de Formatos ─────────────────────────────────────────────────────
const ContentFormatSelector = ({ selected, onChange }) => {
  const toggle = (id) => onChange(prev =>
    prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
  );
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 12 }}>
      {CONTENT_FORMATS.map(fmt => {
        const on = selected.includes(fmt.id);
        return (
          <div
            key={fmt.id}
            onClick={() => toggle(fmt.id)}
            style={{
              cursor: 'pointer', borderRadius: 12, padding: '14px 16px',
              background: on ? fmt.dim : C.surface,
              border: `1.5px solid ${on ? fmt.color : C.border}`,
              transition: 'all .15s', userSelect: 'none',
              display: 'flex', alignItems: 'center', gap: 12,
            }}
          >
            <span style={{ fontSize: 22 }}>{fmt.icon}</span>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: on ? fmt.color : C.text }}>{fmt.label}</p>
              <p style={{ margin: 0, fontSize: 11, color: on ? `${fmt.color}88` : C.muted }}>{fmt.desc}</p>
            </div>
            <div style={{
              marginLeft: 'auto', width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
              background: on ? fmt.color : 'transparent',
              border: `2px solid ${on ? fmt.color : C.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, color: '#000', fontWeight: 900,
            }}>
              {on ? '✓' : ''}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Seletor de Funil ────────────────────────────────────────────────────────
const FunnelSelector = ({ selected, onChange }) => {
  const toggle = (id) => onChange(prev =>
    prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
  );
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:12 }}>
      {FUNNEL_STAGES.map((stage, idx) => {
        const on = selected.includes(stage.id);
        const arrows = ['▲', '◆', '▼'];
        return (
          <div key={stage.id} onClick={() => toggle(stage.id)} style={{
            cursor:'pointer', borderRadius:12, padding:'13px 14px', userSelect:'none',
            background: on ? stage.dim : C.surface,
            border: `1.5px solid ${on ? stage.color : C.border}`,
            transition:'all .15s', position:'relative', overflow:'hidden',
          }}>
            {/* funnel shape indicator */}
            <div style={{
              position:'absolute', top:0, right:0,
              width: idx === 0 ? '100%' : idx === 1 ? '70%' : '40%',
              height:3, background: on ? stage.color : C.border,
              transition:'all .15s',
            }} />
            <div style={{ display:'flex', alignItems:'flex-start', gap:10, marginTop:6 }}>
              <span style={{ fontSize:20 }}>{stage.icon}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <p style={{ margin:0, fontSize:13, fontWeight:800, color: on ? stage.color : C.text }}>{stage.short}</p>
                  <div style={{
                    width:17, height:17, borderRadius:'50%', flexShrink:0,
                    background: on ? stage.color : 'transparent',
                    border:`2px solid ${on ? stage.color : C.border}`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:9, color:'#000', fontWeight:900,
                  }}>{on ? '✓' : ''}</div>
                </div>
                <p style={{ margin:'2px 0 0', fontSize:11, color: on ? `${stage.color}99` : C.muted, lineHeight:1.3 }}>{stage.desc}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Seletor de Meses ─────────────────────────────────────────────────────────
const MonthSelector = ({ selected, onChange, selectedFormats, setSelectedFormats, meses, selectedFunnel, setSelectedFunnel }) => {
  const toggle = (id) => onChange(prev =>
    prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
  );
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '20px 24px', marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>⚙️ Configurações de Conteúdo</h3>
          <p style={{ margin: '3px 0 0', fontSize: 12, color: C.muted }}>
            Escolha formato, funil e meses — a IA cruza com sazonalidades do país selecionado
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => onChange(meses.map(m => m.id))} style={{ background: C.accentDim, color: C.accent, border: `1px solid ${C.accent}44`, borderRadius: 7, padding: '5px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Todos</button>
          <button onClick={() => onChange([])} style={{ background: C.surface, color: C.muted, border: `1px solid ${C.border}`, borderRadius: 7, padding: '5px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Limpar</button>
        </div>
      </div>

      {/* Formatos */}
      <p style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: 1.2, margin: '0 0 8px', fontWeight: 700 }}>Tipo de conteúdo</p>
      <ContentFormatSelector selected={selectedFormats} onChange={setSelectedFormats} />

      {/* Funil */}
      <p style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: 1.2, margin: '0 0 8px', fontWeight: 700 }}>Etapa do funil</p>
      <FunnelSelector selected={selectedFunnel} onChange={setSelectedFunnel} />

      {/* Grid de meses */}
      <p style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: 1.2, margin: '0 0 8px', fontWeight: 700 }}>Meses de publicação</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
        {meses.map(m => {
          const isSelected = selected.includes(m.id);
          return (
            <div
              key={m.id}
              onClick={() => toggle(m.id)}
              title={m.eventos.join(' · ')}
              style={{
                cursor: 'pointer',
                borderRadius: 10,
                padding: '10px 8px',
                textAlign: 'center',
                background: isSelected ? C.accentDim : C.surface,
                border: `1px solid ${isSelected ? C.accent : C.border}`,
                transition: 'all .15s',
                userSelect: 'none',
              }}
            >
              <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: isSelected ? C.accent : C.text }}>{MESES[m.id]}</p>
              <p style={{ margin: '3px 0 0', fontSize: 9, color: isSelected ? `${C.accent}99` : C.muted, lineHeight: 1.3 }}>
                {m.eventos[0].split('(')[0].trim()}
              </p>
            </div>
          );
        })}
      </div>

      {selected.length > 0 && (
        <div style={{ marginTop: 14, padding: '10px 14px', background: C.surface, borderRadius: 10, border: `1px solid ${C.border}`, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {selected.sort((a,b)=>a-b).map(id => (
            <span key={id} style={{ background: C.accentDim, color: C.accent, borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>
              {meses[id]?.nome}
              <span style={{ cursor: 'pointer', opacity: .7 }} onClick={() => toggle(id)}>×</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '10px 16px', fontSize: 13 }}>
      <p style={{ color: C.accent, fontWeight: 700, margin: '0 0 4px' }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: C.muted, margin: 0 }}>{p.name}: <b style={{ color: C.text }}>{p.value}</b></p>
      ))}
    </div>
  );
};

// ─── StatCard ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, color }) => (
  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 4, position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 3, background: color || C.accent, borderRadius: '14px 14px 0 0' }} />
    <span style={{ fontSize: 11, color: C.muted, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 700 }}>{label}</span>
    <span style={{ fontSize: 26, fontWeight: 800, color: C.text, lineHeight: 1.15 }}>{value}</span>
    {sub && <span style={{ fontSize: 12, color: C.muted }}>{sub}</span>}
  </div>
);

// ─── CategoryCard ─────────────────────────────────────────────────────────────
const CategoryCard = ({ item, color, rawKeywords, selectedMonths, selectedFormats, pais, qtdInsights, selectedFunnel }) => {
  const [open, setOpen]       = useState(false);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading]   = useState(false);
  const isAlert = item.status === 'Atenção';
  const topKw = [...rawKeywords].sort((a, b) => b.clicks - a.clicks);

  const handleInsight = async (e) => {
    e.stopPropagation();
    setLoading(true);
    const result = await fetchInsight(item.name, rawKeywords, selectedMonths, selectedFormats, pais, qtdInsights, selectedFunnel);
    setInsights(result);
    setLoading(false);
  };

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderLeft: `4px solid ${isAlert ? C.red : C.green}`, borderRadius: '0 12px 12px 0', overflow: 'hidden' }}>

      {/* Cabeçalho */}
      <div onClick={() => setOpen(o => !o)} style={{ padding: '13px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, userSelect: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <div style={{ width: 9, height: 9, borderRadius: '50%', flexShrink: 0, background: isAlert ? C.red : C.green, boxShadow: `0 0 7px ${isAlert ? C.red : C.green}` }} />
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: C.text, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
            <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>{item.count} termo{item.count !== 1 ? 's' : ''} · CTR {item.avgCtr}% · Pos. {item.avgPos}</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 18, fontWeight: 800, color, margin: 0, lineHeight: 1 }}>{item.clicks.toLocaleString('pt-BR')}</p>
            <p style={{ fontSize: 10, color: C.muted, margin: 0, letterSpacing: 1 }}>CLIQUES</p>
          </div>
          <span style={{ color: C.muted, fontSize: 16, display: 'inline-block', transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'none' }}>▾</span>
        </div>
      </div>

      {/* Painel */}
      {open && (
        <div style={{ padding: '0 16px 16px', borderTop: `1px solid ${C.border}` }}>

          {/* Tabela keywords */}
          <p style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: 1.2, margin: '14px 0 8px', fontWeight: 700 }}>Palavras-chave</p>
          <div style={{ maxHeight: 210, overflowY: 'auto', border: `1px solid ${C.border}`, borderRadius: 8 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ background: C.surface, position: 'sticky', top: 0 }}>
                  {['Keyword','Cliques','Impressões','CTR','Posição'].map(h => (
                    <th key={h} style={{ padding: '7px 10px', textAlign: h==='Keyword'?'left':'right', color: C.muted, fontWeight: 600, borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap', fontSize: 11 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topKw.map((kw, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.border}22`, background: i%2===0?'transparent':`${C.surface}66` }}>
                    <td style={{ padding: '6px 10px', color: C.text, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={kw.keyword}>{kw.keyword}</td>
                    <td style={{ padding: '6px 10px', textAlign: 'right', color: kw.clicks>10?C.green:C.red, fontWeight: 600 }}>{kw.clicks}</td>
                    <td style={{ padding: '6px 10px', textAlign: 'right', color: C.muted }}>{(kw.impressions||0).toLocaleString('pt-BR')}</td>
                    <td style={{ padding: '6px 10px', textAlign: 'right', color: C.muted }}>{kw.ctr}%</td>
                    <td style={{ padding: '6px 10px', textAlign: 'right', color: kw.position<=10?C.green:C.yellow, fontWeight: 600 }}>{kw.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Insights — disponível para TODAS as categorias */}
          <div style={{ marginTop: 14 }}>
            {!insights ? (
              <button
                onClick={handleInsight}
                disabled={loading}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, width: '100%', justifyContent: 'center',
                  background: loading ? C.surface : C.accentDim,
                  color: C.accent, border: `1px solid ${C.accent}55`,
                  borderRadius: 8, padding: '9px 14px', fontSize: 12, fontWeight: 700,
                  cursor: loading ? 'wait' : 'pointer',
                }}
              >
                {loading
                  ? <><span style={{ display:'inline-block', animation:'spin 1s linear infinite' }}>⟳</span>&nbsp;Gerando sugestões com IA…</>
                  : <><span>✦</span> Gerar {qtdInsights} insight{qtdInsights>1?'s':''}{selectedFormats && selectedFormats.length > 0 ? ` · ${selectedFormats.length} formato${selectedFormats.length>1?'s':''}` : ''}{selectedMonths.length > 0 ? ` · ${selectedMonths.length} mês${selectedMonths.length>1?'es':''}` : ''}</>
                }
              </button>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <p style={{ fontSize: 10, color: C.accent, textTransform: 'uppercase', letterSpacing: 1.2, margin: 0, fontWeight: 700 }}>✦ Sugestões de conteúdo</p>
                  <button onClick={(e) => { e.stopPropagation(); setInsights(null); }} style={{ background: 'transparent', border: 'none', color: C.muted, fontSize: 11, cursor: 'pointer', padding: 0 }}>↺ Regenerar</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {insights.map((ins, i) => (
                    <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: '11px 14px' }}>
                      {(() => {
                        const fmt = CONTENT_FORMATS.find(f => f.id === ins.formato_id) || CONTENT_FORMATS[0];
                        return (
                          <div style={{ display: 'flex', gap: 7, alignItems: 'center', flexWrap: 'wrap', marginBottom: 7 }}>
                            <span style={{ background: fmt.dim, color: fmt.color, borderRadius: 6, padding: '3px 9px', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 4 }}>
                              {fmt.icon} {fmt.label}
                            </span>
                            <span style={{ background: C.surface, color: C.muted, border: `1px solid ${C.border}`, borderRadius: 6, padding: '3px 9px', fontSize: 10, fontWeight: 600 }}>
                              {ins.tipo}
                            </span>
                            {ins.funil_id && (() => {
                              const st = FUNNEL_STAGES.find(s => s.id === ins.funil_id);
                              return st ? (
                                <span style={{ background: st.dim, color: st.color, borderRadius: 6, padding: '3px 9px', fontSize: 10, fontWeight: 700, display:'flex', alignItems:'center', gap:4 }}>
                                  {st.icon} {st.short}
                                </span>
                              ) : null;
                            })()}
                            {ins.melhor_mes !== null && ins.melhor_mes !== undefined && (
                              <span style={{ background: '#2d1f4a', color: C.purple, borderRadius: 6, padding: '3px 9px', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                                📅 {(PAISES[pais]?.meses || PAISES.MX.meses)[ins.melhor_mes]?.nome}{(PAISES[pais]?.meses || PAISES.MX.meses)[ins.melhor_mes]?.eventos[0] ? ` · ${(PAISES[pais]?.meses || PAISES.MX.meses)[ins.melhor_mes].eventos[0].split('(')[0].trim()}` : ''}
                              </span>
                            )}
                          </div>
                        );
                      })()}
                      <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 700, color: C.text }}>{ins.titulo}</p>
                      <p style={{ margin: '0 0 6px', fontSize: 12, color: C.muted }}>{ins.motivo}</p>
                      {ins.keyword_principal && (
                        <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:4 }}>
                          <span style={{ fontSize:10, color:C.muted, fontWeight:700, textTransform:'uppercase', letterSpacing:0.8 }}>🔑 Keyword principal:</span>
                          <span style={{ background:'#1e2d45', color:C.accent, borderRadius:5, padding:'2px 9px', fontSize:11, fontWeight:700, fontFamily:'monospace' }}>{ins.keyword_principal}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Estado vazio ─────────────────────────────────────────────────────────────
const EmptyState = ({ onUpload }) => (
  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'62vh', gap:20, textAlign:'center' }}>
    <div style={{ width:80, height:80, borderRadius:'50%', background:C.accentDim, display:'flex', alignItems:'center', justifyContent:'center', fontSize:36 }}>📊</div>
    <div>
      <h2 style={{ color:C.text, fontSize:22, fontWeight:700, margin:'0 0 6px' }}>Nenhum dado carregado</h2>
      <p style={{ color:C.muted, fontSize:14, margin:0 }}>Importe um CSV do Google Search Console para começar</p>
    </div>
    <label style={{ cursor:'pointer', background:C.accent, color:'#000', padding:'12px 28px', borderRadius:10, fontWeight:700, fontSize:14, display:'flex', alignItems:'center', gap:8 }}>
      ⬆ Importar CSV
      <input type="file" accept=".csv" onChange={onUpload} style={{ display:'none' }} />
    </label>
    <p style={{ color:C.muted, fontSize:12 }}>Colunas esperadas: keyword, clicks, impressions, ctr, position</p>
  </div>
);

// ─── Dashboard principal ──────────────────────────────────────────────────────
export default function SEODashboard() {
  const [data, setData]               = useState([]);
  const [rawByCategory, setRawByCategory] = useState({});
  const [rawCount, setRawCount]       = useState(0);
  const [fileName, setFileName]       = useState('');
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [selectedFormats, setSelectedFormats] = useState(['artigo','landing','social']);
  const [pais, setPais] = useState('MX');
  const [qtdInsights, setQtdInsights] = useState(5);
  const [selectedFunnel, setSelectedFunnel] = useState(['topo','meio','fundo']);

  const processCSV = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const rows = ev.target.result.split('\n').slice(1).filter(Boolean);
      setRawCount(rows.length);
      const results = rows.map(row => {
        const cols = row.split(',');
        const keyword    = cols[0]?.toLowerCase().trim() || '';
        const clicks     = parseInt(cols[1])   || 0;
        const impressions= parseInt(cols[2])   || 0;
        const ctr        = parseFloat(cols[3]) || 0;
        const position   = parseFloat(cols[4]) || 0;
        const catMap = PAISES[pais]?.categorias || PAISES.MX.categorias;
        let category = 'Outros';
        for (const [cat, kws] of Object.entries(catMap)) {
          if (kws.some(k => keyword.includes(k))) { category = cat; break; }
        }
        return { keyword, clicks, impressions, ctr, position, category };
      });

      const rawMap = results.reduce((acc, cur) => {
        if (!acc[cur.category]) acc[cur.category] = [];
        acc[cur.category].push(cur);
        return acc;
      }, {});
      setRawByCategory(rawMap);

      const summary = results.reduce((acc, cur) => {
        if (!acc[cur.category]) acc[cur.category] = { name: cur.category, clicks:0, impressions:0, count:0, _ctr:0, _pos:0 };
        acc[cur.category].clicks      += cur.clicks;
        acc[cur.category].impressions += cur.impressions;
        acc[cur.category].count       += 1;
        acc[cur.category]._ctr        += cur.ctr;
        acc[cur.category]._pos        += cur.position;
        return acc;
      }, {});

      const final = Object.values(summary).map(item => ({
        ...item,
        avgCtr: +(item._ctr / item.count).toFixed(2),
        avgPos: +(item._pos / item.count).toFixed(1),
        status: (item.clicks / item.count) > 10 ? 'OK' : 'Atenção',
      })).sort((a, b) => b.clicks - a.clicks);

      setData(final);
    };
    reader.readAsText(file);
  }, [pais]);

  const totalClicks      = data.reduce((s,d) => s + d.clicks, 0);
  const totalImpressions = data.reduce((s,d) => s + d.impressions, 0);
  const alertCount       = data.filter(d => d.status === 'Atenção').length;

  return (
    <div style={{ background:C.bg, minHeight:'100vh', fontFamily:"'DM Sans','Segoe UI',sans-serif", color:C.text, padding:'32px 28px', boxSizing:'border-box' }}>
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:32, flexWrap:'wrap', gap:12 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:`linear-gradient(135deg,${C.accent},#0070f3)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:800, color:'#000' }}>M</div>
            <h1 style={{ margin:0, fontSize:22, fontWeight:800, letterSpacing:-0.5 }}>Madesa {PAISES[pais]?.flag} — SEO Clusters</h1>
          </div>
          <p style={{ margin:0, color:C.muted, fontSize:13 }}>
{fileName ? `Arquivo: ${fileName} · ${rawCount} palavras-chave processadas` : `Performance por categoria de produto · ${PAISES[pais]?.site}`}
          </p>
        </div>
        {data.length > 0 && (
          <label style={{ cursor:'pointer', display:'flex', alignItems:'center', gap:6, background:C.accentDim, color:C.accent, border:`1px solid ${C.accent}40`, padding:'8px 16px', borderRadius:8, fontSize:13, fontWeight:600 }}>
            ↩ Novo arquivo
            <input type="file" accept=".csv" onChange={processCSV} style={{ display:'none' }} />
          </label>
        )}
      </div>

      {data.length === 0 ? <EmptyState onUpload={processCSV} /> : (
        <>
          {/* KPIs */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:14, marginBottom:28 }}>
            <StatCard label="Total de Cliques"   value={totalClicks.toLocaleString('pt-BR')}      sub="soma de todos os clusters"      color={C.accent}  />
            <StatCard label="Impressões"          value={totalImpressions.toLocaleString('pt-BR')} sub="visibilidade total"             color={C.purple}  />
            <StatCard label="Clusters Ativos"     value={data.length}                              sub={`${alertCount} precisam de atenção`} color={alertCount>0?C.yellow:C.green} />
            <StatCard label="Melhor Cluster"      value={data[0]?.name||'–'}                       sub={`${data[0]?.clicks?.toLocaleString('pt-BR')} cliques`} color={C.green} />
          </div>

          {/* País + Qtd */}
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:'18px 24px', marginBottom:12 }}>
            <CountrySelector selected={pais} onChange={p => { setPais(p); setData([]); setRawByCategory({}); setFileName(''); }} qtdInsights={qtdInsights} setQtdInsights={setQtdInsights} />
          </div>

          {/* Seletor de meses */}
          <MonthSelector selected={selectedMonths} onChange={setSelectedMonths} selectedFormats={selectedFormats} setSelectedFormats={setSelectedFormats} meses={PAISES[pais]?.meses || PAISES.MX.meses} selectedFunnel={selectedFunnel} setSelectedFunnel={setSelectedFunnel} />

          {/* Gráfico + Cards */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 370px', gap:20, alignItems:'start', marginBottom:20 }}>

            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:'24px 20px' }}>
              <h3 style={{ margin:'0 0 20px', fontSize:15, fontWeight:700 }}>Cliques por Categoria</h3>
              <div style={{ height:280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} barSize={32}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                    <XAxis dataKey="name" tick={{ fill:C.muted, fontSize:11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill:C.muted, fontSize:11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill:'#ffffff05' }} />
                    <Bar dataKey="clicks" name="Cliques" radius={[6,6,0,0]}>
                      {data.map((entry, i) => (
                        <Cell key={i} fill={CAT_COLORS[i%CAT_COLORS.length]} fillOpacity={entry.status==='Atenção'?0.4:1} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:2 }}>
                <h3 style={{ margin:0, fontSize:15, fontWeight:700 }}>Status dos Clusters</h3>
                <span style={{ fontSize:11, color:C.muted }}>clique para expandir</span>
              </div>
              {data.map((item, i) => (
                <CategoryCard
                  key={i}
                  item={item}
                  color={CAT_COLORS[i%CAT_COLORS.length]}
                  rawKeywords={rawByCategory[item.name]||[]}
                  selectedMonths={selectedMonths}
                  selectedFormats={selectedFormats}
                  pais={pais}
                  qtdInsights={qtdInsights}
                  selectedFunnel={selectedFunnel}
                />
              ))}
            </div>
          </div>

          {/* Radar + Resumo */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:'24px 20px' }}>
              <h3 style={{ margin:'0 0 16px', fontSize:15, fontWeight:700 }}>CTR Médio por Cluster</h3>
              <div style={{ height:240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={data}>
                    <PolarGrid stroke={C.border} />
                    <PolarAngleAxis dataKey="name" tick={{ fill:C.muted, fontSize:11 }} />
                    <Radar name="CTR" dataKey="avgCtr" stroke={C.accent} fill={C.accent} fillOpacity={0.15} strokeWidth={2} />
                    <Tooltip content={<ChartTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:'24px 20px' }}>
              <h3 style={{ margin:'0 0 16px', fontSize:15, fontWeight:700 }}>Resumo de Status</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
                {data.map((item, i) => {
                  const isAlert = item.status === 'Atenção';
                  return (
                    <div key={i} style={{ display:'flex', gap:12, padding:'10px 14px', background:C.surface, borderRadius:10, border:`1px solid ${C.border}` }}>
                      <span style={{ fontSize:16, flexShrink:0 }}>{isAlert?'⚠️':'✅'}</span>
                      <div>
                        <p style={{ margin:0, fontSize:13, fontWeight:700, color:C.text }}>{item.name}</p>
                        <p style={{ margin:0, fontSize:12, color:C.muted }}>
                          {isAlert
                            ? 'Abra o card para ver as keywords e gerar sugestões com IA.'
                            : `Cluster saudável · CTR ${item.avgCtr}% · Posição média ${item.avgPos}`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
