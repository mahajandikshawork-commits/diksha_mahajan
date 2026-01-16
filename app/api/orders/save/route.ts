import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { Order } from '@/types/database';

export async function POST(req: NextRequest) {
  try {
    const orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'> = await req.json();

    const { data, error } = await supabaseAdmin
      .from('orders')
      .insert([orderData])
      .select()
      .single();

    if (error) {
      console.error('Error saving order to Supabase:', error);
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to save order',
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Order saved successfully',
      data,
    });
  } catch (error: any) {
    console.error('Error in save order API:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to save order',
      },
      { status: 500 }
    );
  }
}
