import { Category } from './pages/categories/shared/category.model';
import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDatabase implements InMemoryDbService {
    constructor() {

    }
    createDb() {
        const categories: Category[] = [
            { id: 1, name: 'Moradia', description: 'Pagamento de Contas da Casa' },
            { id: 2, name: 'Saúde', description: 'Plano de saúde e Remédios' },
            { id: 3, name: 'Lazer', description: 'Cinema, parques, proaia, etc.' },
            { id: 4, name: 'Salário', description: 'Recebimento de Salário' },
            { id: 5, name: 'Freelas', description: 'Trabalhos como freelancer' }
        ];
        return categories;
    }
}
