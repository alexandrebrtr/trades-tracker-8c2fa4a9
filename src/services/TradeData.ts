
import { supabase } from '@/integrations/supabase/client';

export interface ImportResult {
  totalTrades: number;
  successfulImports: number;
  failedImports: number;
  errors: Array<{
    message: string;
    row?: any;
  }>;
}

export const TradeData = {
  /**
   * Import trades from CSV data
   */
  async importTradesFromCSV(userId: string, csvData: string): Promise<ImportResult> {
    if (!csvData.trim()) {
      throw new Error('CSV data is empty');
    }

    const lines = csvData.trim().split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    
    // Result tracking
    const result: ImportResult = {
      totalTrades: lines.length - 1, // Excluding header row
      successfulImports: 0,
      failedImports: 0,
      errors: []
    };

    // Process each row (skip header)
    for (let i = 1; i < lines.length; i++) {
      try {
        const line = lines[i];
        if (!line.trim()) continue; // Skip empty lines
        
        const values = line.split(',').map(value => value.trim());
        const row: Record<string, any> = {};
        
        // Map CSV columns to object properties
        headers.forEach((header, index) => {
          row[header.toLowerCase()] = values[index] || '';
        });
        
        // Extract and validate trade data
        const trade = {
          user_id: userId,
          date: row.date || new Date().toISOString(),
          symbol: row.asset || row.symbol || 'Unknown',
          type: row.type?.toLowerCase() || 'long',
          entry_price: parseFloat(row.entryprice || row['entry_price'] || '0'),
          exit_price: parseFloat(row.exitprice || row['exit_price'] || '0'),
          size: parseFloat(row.size || '0'),
          pnl: parseFloat(row.pnl || row['p&l'] || '0'),
          strategy: row.strategy || 'Manual',
          notes: row.notes || ''
        };
        
        // Validate required fields
        if (isNaN(trade.entry_price) || isNaN(trade.exit_price) || isNaN(trade.size)) {
          throw new Error('Invalid price or size values');
        }
        
        // Save to database
        const { error } = await supabase.from('trades').insert(trade);
        if (error) throw error;
        
        result.successfulImports++;
      } catch (error: any) {
        result.failedImports++;
        result.errors.push({
          message: error.message || 'Unknown error',
          row: lines[i]
        });
      }
    }
    
    return result;
  },
  
  /**
   * Load user trades
   */
  async getUserTrades(userId: string) {
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
};
