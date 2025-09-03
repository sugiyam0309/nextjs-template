import { http, HttpResponse } from 'msw';

// Mock data
const mockProducts = [
  {
    id: '1',
    name: 'Product 1',
    description: 'Description for product 1',
    price: 100,
    image: '/images/product1.jpg',
  },
  {
    id: '2',
    name: 'Product 2',
    description: 'Description for product 2',
    price: 200,
    image: '/images/product2.jpg',
  },
  {
    id: '3',
    name: 'Product 3',
    description: 'Description for product 3',
    price: 300,
    image: '/images/product3.jpg',
  },
];

const mockSearchResults = [
  {
    id: '1',
    title: 'Search Result 1',
    description: 'Description for search result 1',
    url: '/result/1',
    category: 'Category A',
  },
  {
    id: '2',
    title: 'Search Result 2',
    description: 'Description for search result 2',
    url: '/result/2',
    category: 'Category B',
  },
];

// Define request handlers
export const handlers = [
  // Search API
  http.get('/api/search', ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('q');
    const category = url.searchParams.get('category');
    const page = url.searchParams.get('page') || '1';
    const limit = url.searchParams.get('limit') || '10';

    // Filter results based on query
    let results = mockSearchResults;
    if (query) {
      results = results.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase())
      );
    }
    if (category) {
      results = results.filter((item) => item.category === category);
    }

    return HttpResponse.json({
      results,
      total: results.length,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  }),

  // Search history API
  http.get('/api/search/history', () => {
    return HttpResponse.json({
      history: [
        { query: 'recent search 1', timestamp: new Date().toISOString() },
        { query: 'recent search 2', timestamp: new Date().toISOString() },
      ],
    });
  }),

  http.post('/api/search/history', async ({ request }) => {
    const body = await request.json() as { query: string };
    return HttpResponse.json({
      success: true,
      query: body.query,
    });
  }),

  http.delete('/api/search/history', () => {
    return HttpResponse.json({
      success: true,
    });
  }),

  // Products API
  http.get('/api/products', ({ request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || '1';
    const limit = url.searchParams.get('limit') || '10';

    return HttpResponse.json({
      products: mockProducts,
      total: mockProducts.length,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  }),

  http.get('/api/products/:id', ({ params }) => {
    const product = mockProducts.find((p) => p.id === params.id);
    if (!product) {
      return HttpResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    return HttpResponse.json(product);
  }),

  http.post('/api/products', async ({ request }) => {
    const body = await request.json() as Record<string, any>;
    const newProduct = {
      id: String(mockProducts.length + 1),
      ...body,
    } as typeof mockProducts[0];
    mockProducts.push(newProduct);
    return HttpResponse.json(newProduct, { status: 201 });
  }),

  http.put('/api/products/:id', async ({ params, request }) => {
    const body = await request.json() as Record<string, any>;
    const index = mockProducts.findIndex((p) => p.id === params.id);
    if (index === -1) {
      return HttpResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    mockProducts[index] = { ...mockProducts[index], ...body };
    return HttpResponse.json(mockProducts[index]);
  }),

  http.delete('/api/products/:id', ({ params }) => {
    const index = mockProducts.findIndex((p) => p.id === params.id);
    if (index === -1) {
      return HttpResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    mockProducts.splice(index, 1);
    return HttpResponse.json({ success: true });
  }),
];
