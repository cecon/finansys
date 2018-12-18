import { Category } from './../../categories/shared/category.model';
import { BaseResourceModel } from '../../../shared/models/base-resource.model';
export class Entry extends BaseResourceModel {
    static types = {
        expense: 'Despesa',
        revenue: 'Receita'
    };

    constructor() {
        super();
    }
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
