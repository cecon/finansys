import { Category } from './../../categories/shared/category.model';
export class Entry {
    static types = {
        expense: 'Despesa',
        revenue: 'Receita'
    };

    constructor() {

    }

    id?: number;
    name?: string;
    description?: string;
    type?: string;
    amount?: string;
    date?: string;
    paid?: boolean;
    categoryId?: number;
    category?: Category;

    get paidText(): string {
        return this.paid ? 'Pago' : 'Pendente';
    }

}
