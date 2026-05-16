// Dados simulados do app WheelTrack
// Em um app real, esses dados viriam de uma API
// Por enquanto, usamos dados fixos para aprendizado

export const user = {
  name: 'Lavinia Milena',
  email: 'lavinia123@gmail.com',
  avatar: null,
};

export const vehicles = [
  {
    id: '1',
    model: 'Porsche 911',
    plate: 'ABC-1212',
    color: 'Prata',
    year: 2023,
    blindingLevel: 2,
    status: 'Em andamento',
    statusColor: '#00B4D8',
    progress: 55, // porcentagem concluída
    image: require('../../assets/porsche.png'),
  },
  {
    id: '2',
    model: 'Range Rover SV',
    plate: 'XYZ-3021',
    color: 'Preto',
    year: 2022,
    blindingLevel: 3,
    status: 'Concluído',
    statusColor: '#00C896',
    progress: 100,
    image: require('../../assets/rangerover.png'),
  },
];

export const blindingSteps = [
  {
    id: '1',
    title: 'Preparação e documentação',
    status: 'completed', // completed | active | pending
    substeps: [
      { text: 'Verificação dos dados do veículo', done: true },
      { text: 'Coleta de documentação', done: true },
      { text: 'Solicitação da autorização ao Exército Brasileiro', done: true },
    ],
  },
  {
    id: '2',
    title: 'Autorização oficial',
    status: 'completed',
    substeps: [
      { text: 'Envio do pedido ao Exército', done: true },
      { text: 'Recebimento da Autorização de Blindagem', done: true },
      { text: 'Liberação para início dos trabalhos', done: true },
    ],
  },
  {
    id: '3',
    title: 'Preparação do veículo',
    status: 'completed',
    substeps: [
      { text: 'Inspeção inicial do carro', done: true },
      { text: 'Desmontagem de componentes internos', done: true },
      { text: 'Remoção dos vidros originais', done: true },
      { text: 'Proteção e isolamento de componentes sensíveis', done: true },
    ],
  },
  {
    id: '4',
    title: 'Aplicação da blindagem',
    status: 'active',
    substeps: [
      { text: 'Corte e preparo de placas de aço balístico', done: true },
      { text: 'Aplicação dos materiais balísticos nas áreas vulneráveis', done: true },
      { text: 'Verificação de adaptação de estrutura', done: false },
      { text: 'Tratamento anticorrosão', done: false },
    ],
  },
  {
    id: '5',
    title: 'Instalação de vidros balísticos',
    status: 'pending',
    substeps: [
      { text: 'Seleção de vidros certificados', done: false },
      { text: 'Instalação dos vidros balísticos', done: false },
      { text: 'Teste de vedação e abertura/fechamento', done: false },
    ],
  },
  {
    id: '6',
    title: 'Blindagem de componentes internos',
    status: 'pending',
    substeps: [
      { text: 'Blindagem interna', done: false },
      { text: 'Blindagem de áreas internas específicas', done: false },
    ],
  },
  {
    id: '7',
    title: 'Remontagem',
    status: 'pending',
    substeps: [
      { text: 'Remontagem dos painéis, forros, estofados', done: false },
      { text: 'Reinstalação de componentes elétricos e eletrônicos', done: false },
    ],
  },
  {
    id: '8',
    title: 'Inspeções e testes de qualidade',
    status: 'pending',
    substeps: [
      { text: 'Inspeção estruturada de blindagem', done: false },
      { text: 'Teste de funcionamento', done: false },
      { text: 'Teste de rodagem / dinâmica', done: false },
    ],
  },
  {
    id: '9',
    title: 'Documentação final e entrega',
    status: 'pending',
    substeps: [
      { text: 'Emissão da Declaração de Blindagem', done: false },
      { text: 'Entrega do veículo blindado', done: false },
    ],
  },
];

export const notifications = [
  {
    id: '1',
    vehicle: 'Porsche 911',
    step: 'Solicitação da autorização ao Exército Brasileiro',
    label: 'etapa concluída',
    time: '12:57',
    read: true,
  },
  {
    id: '2',
    vehicle: 'Porsche 911',
    step: 'Liberação para início dos trabalhos',
    label: 'etapa concluída',
    time: '19:10',
    read: false,
  },
  {
    id: '3',
    vehicle: 'Porsche 911',
    step: 'Proteção e isolamento de componentes sensíveis',
    label: 'etapa concluída',
    time: '19:10',
    read: false,
  },
  {
    id: '4',
    vehicle: 'Porsche 911',
    step: 'Tratamento anticorrosão',
    label: 'etapa em andamento',
    time: '15:29',
    read: false,
  },
];

export const documents = [
  {
    id: '1',
    category: 'Documentos principais',
    items: [
      { name: 'Nota fiscal da blindagem', size: '4,2MB', date: '12/03/2025', type: 'PDF' },
      { name: 'Certificado de blindagem', size: '1,2MB', date: '12/03/2025', type: 'PDF' },
      { name: 'Termos e condições de blindagem', size: '3,2MB', date: '12/03/2025', type: 'PDF' },
    ],
  },
  {
    id: '2',
    category: 'Garantias e manuais',
    items: [
      { name: 'Termo de garantia da blindagem', size: '5,2MB', date: '12/03/2025', type: 'PDF' },
      { name: 'Manual de uso e cuidados', size: '2,2MB', date: '12/03/2025', type: 'PDF' },
      { name: 'Manual de manutenção programada', size: '4,2MB', date: '12/03/2025', type: 'PDF' },
    ],
  },
  {
    id: '3',
    category: 'Laudos e anexos',
    items: [
      { name: 'Laudo técnico da blindagem', size: '5,2MB', date: '12/03/2025', type: 'PDF' },
      { name: 'Registro fotográfico', size: '2,2MB', date: '12/03/2025', type: 'PDF' },
    ],
  },
];

export const maintenance = {
  vehicle: 'Porsche 911',
  lastMaintenance: '12/03/2026',
  nextRevision: '15/06/2026',
  warrantyStatus: 'Ativa',
  structuralIntegrity: 94,
};