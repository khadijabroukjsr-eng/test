// api/dos.js - Endpoint vulnérable à DoS
export default function handler(req, res) {
  // Désactiver le cache pour Vercel
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  
  // Gestion des méthodes
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  let type = 'cpu';
  let duration = 5000;
  let size = 10000;
  
  // Récupérer les paramètres selon la méthode
  if (req.method === 'POST') {
    type = req.body?.type || type;
    duration = req.body?.duration || duration;
    size = req.body?.size || size;
  } else if (req.method === 'GET') {
    type = req.query?.type || type;
    duration = parseInt(req.query?.duration) || duration;
    size = parseInt(req.query?.size) || size;
  }
  
  console.log(`[DOS API] ${req.method} - Type: ${type}, Duration: ${duration}ms, Size: ${size}`);
  
  // Simulation d'une tâche très lourde
  if (type === 'cpu') {
    // Blocage CPU synchrone (TRÈS VULNÉRABLE)
    const start = Date.now();
    let computations = 0;
    while (Date.now() - start < duration) {
      // Boucle bloquante - consomme 100% CPU
      for (let i = 0; i < 1000; i++) {
        Math.sqrt(Math.random() * Math.random() * Math.random());
        computations++;
      }
    }
    
    // Générer une grosse réponse
    const bigData = 'x'.repeat(size);
    
    return res.status(200).json({ 
      message: `CPU bloqué pendant ${duration}ms`,
      computations: computations,
      data_size: bigData.length,
      timestamp: Date.now()
    });
  }
  
  if (type === 'memory') {
    // Consommation mémoire massive
    const memoryHog = [];
    const chunks = Math.floor(size / 1000) || 100;
    
    for (let i = 0; i < chunks; i++) {
      memoryHog.push(new Array(1000).fill(`memory_chunk_${i}_${Date.now()}`));
    }
    
    return res.status(200).json({ 
      memory: 'saturated',
      chunks: chunks,
      totalSize: `${chunks * 1000} elements`,
      timestamp: Date.now()
    });
  }
  
  if (type === 'io') {
    // Simulation d'I/O lent avec grosse réponse
    const bigResponse = {
      timestamp: Date.now(),
      data: 'io_heavy_data|'.repeat(size / 16).slice(0, size),
      items: []
    };
    
    // Remplir avec des données
    for (let i = 0; i < 100; i++) {
      bigResponse.items.push({
        id: i,
        content: `Item ${i} - ${Math.random().toString(36).substring(7)}`,
        metadata: 'meta'.repeat(25)
      });
    }
    
    return res.status(200).json(bigResponse);
  }
  
  res.status(400).json({ 
    error: 'Type non supporté',
    supported_types: ['cpu', 'memory', 'io'],
    timestamp: Date.now()
  });
}
