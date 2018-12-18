import { BaseResourceModel } from '../../../shared/models/base-resource.model';

export class Category extends BaseResourceModel {

    constructor() {
        super();
    }
    name?: string;
    description?: string;
}
