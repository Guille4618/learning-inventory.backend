import { NextResponse } from 'next/server';
import sql from '@/lib/db';

// GET - Obtener todos los productos con su categoría
export async function GET() {
  try {
    const products = await sql`
      SELECT p.id, p.name, p.price, p.stock, c.name AS category
      FROM products p
      INNER JOIN categories c ON p.category_id = c.id
      ORDER BY c.name, p.name
    `;
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    );
  }
}

// POST - Insertar un producto nuevo
export async function POST(request: Request) {
  try {
    const { name, price, stock, category_id } = await request.json();
    const result = await sql`
      INSERT INTO products (name, price, stock, category_id)
      VALUES (${name}, ${price}, ${stock}, ${category_id})
      RETURNING *
    `;
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al insertar producto' },
      { status: 500 }
    );
  }
}