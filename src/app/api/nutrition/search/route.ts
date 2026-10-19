import { nutritionRequest } from '@/lib/nutrition/server';
export async function GET(request: Request) { return nutritionRequest(request,'search'); }
