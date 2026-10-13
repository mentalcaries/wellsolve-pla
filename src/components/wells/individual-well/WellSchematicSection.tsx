import { Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../../estimates/ui/button';

export function WellSchematicSection() {
  return <Card><CardHeader className='p-4 pb-3'><div className='flex items-center justify-between gap-3'><CardTitle className='text-base font-semibold leading-6'>Well schematic</CardTitle></div></CardHeader><CardContent className='px-4 pb-4'><div className='flex flex-col items-center gap-3 py-8 text-center'><p className='text-sm text-muted-foreground'>No schematic uploaded</p><Button size='sm' variant='outline'><Upload className='mr-2 h-4 w-4'/>Upload schematic</Button></div></CardContent></Card>;
}
