import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { CostContingency } from './CostContingency';
import { EconomicImpactSummary } from './EconomicImpactSummary';
import { EstimateItemRow } from './EstimateItemRow';
import type { EstimateCategory, EstimatesFormValues } from './estimate-data';
import { formatCurrency, parseNum } from './formatting';
import { ProjectedProductionLoss, type ProductionLossTotals } from './ProjectedProductionLoss';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

const emptyProductionLoss: ProductionLossTotals = { total: 0, dailyAvoidedLoss: 0, oilPrice: 60, gasPrice: 3.25 };

export function EstimatesFormSection() {
  const { control } = useFormContext<EstimatesFormValues>();
  const estimates = useWatch({ control, name: 'estimates' });
  const totalCost = estimates.reduce((grand,category)=>grand+category.items.reduce((sum,item)=>sum+parseNum(item.amount)*parseNum(item.days)*parseNum(item.unitCost),0),0);
  const initialExpanded=Object.fromEntries(estimates.map((category,index)=>[index,index===0||category.items.some(item=>parseNum(item.unitCost)>0)]));
  const [expanded,setExpanded]=useState<Record<number,boolean>>(initialExpanded);
  const [contingency,setContingency]=useState(0);
  const [productionLoss,setProductionLoss]=useState<ProductionLossTotals>(emptyProductionLoss);
  const updateContingency=useCallback((value:number)=>setContingency(value),[]);
  const updateProductionLoss=useCallback((value:ProductionLossTotals)=>setProductionLoss(value),[]);
  return <div className='actual-estimates'>
    <div className='my-3'><h2 className='text-lg font-semibold'>Estimated Costs</h2><p className='font-light'>Calculate the estimated costs and duration of proposed solutions.</p></div>
    {estimates.map((category,index)=><CategoryTable key={category.name} category={category} categoryIndex={index} totalCost={totalCost} isExpanded={expanded[index]??false} onToggle={()=>setExpanded(current=>({...current,[index]:!current[index]}))}/>)}
    <div className='mt-8 text-right'><h3 className='text-xl font-semibold'>Final Total (USD)</h3><p className='text-2xl font-bold'>{formatCurrency(totalCost)}</p></div>
    <ProjectedProductionLoss onChange={updateProductionLoss}/>
    <CostContingency estimatesTotalCost={totalCost} onExposureChange={updateContingency}/>
    <EconomicImpactSummary interventionCost={totalCost} contingency={contingency} productionLoss={productionLoss}/>
    <section className='mt-8 rounded-lg border border-border bg-[#fbfcfe] p-5'><h2 className='text-xl font-semibold'>Assessment Summary</h2><p className='mt-1 font-light'>The completed report summary will include intervention cost, projected production loss, economic impact, and recovery assumptions.</p><Button type='button' className='mt-4'>Generate Summary</Button></section>
  </div>;
}

function CategoryTable({category,categoryIndex,totalCost,isExpanded,onToggle}:{category:EstimateCategory;categoryIndex:number;totalCost:number;isExpanded:boolean;onToggle:()=>void}){
  const {control}=useFormContext<EstimatesFormValues>();
  const {fields,append,remove}=useFieldArray({control,name:`estimates.${categoryIndex}.items` as 'estimates.0.items'});
  const items=useWatch({control,name:`estimates.${categoryIndex}.items` as 'estimates.0.items'});
  const categoryTotal=items.reduce((sum,item)=>sum+parseNum(item.amount)*parseNum(item.days)*parseNum(item.unitCost),0);
  return <div className='mb-8'><button type='button' onClick={onToggle} className='flex w-full items-center justify-between rounded-md px-2 py-2 text-left transition-colors hover:bg-muted/50'><div className='flex items-center gap-2'>{isExpanded?<ChevronDown className='h-5 w-5'/>:<ChevronRight className='h-5 w-5'/>}<h3 className='text-lg font-semibold'>{category.name}</h3></div><span className='text-sm font-medium text-muted-foreground'>Subtotal: {formatCurrency(categoryTotal)}</span></button><div className={`grid transition-[grid-template-rows] duration-300 ${isExpanded?'grid-rows-[1fr]':'grid-rows-[0fr]'}`}><div className='overflow-hidden'><div className='mt-4 pl-8'><Table className='table-fixed'><TableHeader><TableRow><TableHead className='w-[22%] text-base'>Description</TableHead><TableHead className='w-[13%]'>Unit</TableHead><TableHead className='w-[10%]'>Amount</TableHead><TableHead className='w-[10%]'>Days</TableHead><TableHead className='w-[17%]'>Unit Cost (USD)</TableHead><TableHead className='w-[18%] text-right'>Total (USD)</TableHead><TableHead className='w-[10%] text-center'>% of Total</TableHead></TableRow></TableHeader><TableBody>{fields.map((field,index)=><EstimateItemRow key={field.id} item={items[index]} index={index} categoryIndex={categoryIndex} totalCost={totalCost} onDelete={items[index].isCustom?()=>remove(index):undefined}/>)}<TableRow><TableCell colSpan={7}><Button type='button' variant='outline' size='sm' onClick={()=>append({id:crypto.randomUUID(),description:'',unit:'',amount:'',days:'',unitCost:'',isCustom:true})}><Plus className='mr-1 h-4 w-4'/>Add custom line</Button></TableCell></TableRow><TableRow><TableCell colSpan={5} className='font-semibold'>Subtotal</TableCell><TableCell className='text-right font-semibold'>{formatCurrency(categoryTotal)}</TableCell><TableCell className='text-center font-semibold'>{totalCost?`${(categoryTotal/totalCost*100).toFixed(1)}%`:'0.0%'}</TableCell></TableRow></TableBody></Table></div></div></div></div>;
}
