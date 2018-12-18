import { OnInit, AfterContentChecked, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import * as toastr from 'toastr';
import { switchMap } from 'rxjs/operators';

import { BaseResourceModel } from '../../models/base-resource.model';
import { BaseResourceService } from '../../services/base-resource.service';

export abstract class BaseResourceFormComponent<T extends BaseResourceModel> implements OnInit, AfterContentChecked {

    currentAction: string;
    resourceForm: FormGroup;
    pageTitle: string;
    serverErrorMessage: string[] = null;
    submittingForm = false;

    protected route: ActivatedRoute;
    protected router: Router;
    protected fb: FormBuilder;
    constructor(
        protected injector: Injector,
        public resource: T,
        protected resourceService: BaseResourceService<T>,
        protected jsonDataToResourceFn: (jsonData) => T
    ) {
        this.route = injector.get(ActivatedRoute);
        this.router = injector.get(Router);
        this.fb = injector.get(FormBuilder);
    }

    ngOnInit(): void {
        this.setCurrentAction();
        this.buldResourceForm();
        this.loadResource();
    }

    ngAfterContentChecked(): void {
        this.setPageTitle();
    }

    protected setCurrentAction() {
        const r = this.route.snapshot.url[1] || { path: null };
        if (r.path === 'edit') {
            this.currentAction = 'edit';
        } else {
            this.currentAction = 'new';
        }
    }

    protected loadResource() {
        if (this.currentAction === 'edit') {
            this.route.paramMap.pipe(
                switchMap(params => this.resourceService.getById(+params.get('id')))
            ).subscribe(resource => {
                this.resource = resource;
                this.resourceForm.patchValue(this.resource);
            },
                () => {
                    alert('Ocorreu um erro no servidor');
                });
        }
    }

    submitForm() {
        this.submittingForm = true;
        if (this.currentAction === 'new') {
            this.createResource();
        } else {
            this.updateResource();
        }
    }
    protected setPageTitle(): void {
        if (this.currentAction === 'new') {
            this.pageTitle = this.creationPageTitle();
        } else {
            this.pageTitle = this.editionPageTitle();
        }
    }

    protected createResource() {
        const resource = this.jsonDataToResourceFn(this.resourceForm.value);
        this.resourceService.create(resource).subscribe(
            res => this.actionsForSuccess(res),
            error => this.actionsForError(error)
        );

    }

    protected updateResource() {
        const resource = this.jsonDataToResourceFn(this.resourceForm.value);
        this.resourceService.update(resource).subscribe(
            res => this.actionsForSuccess(res),
            error => this.actionsForError(error)
        );
    }

    protected actionsForSuccess(resource: T) {
        toastr.success('Solicitação processada com sucesso');
        const resourceComponentPath: string = this.route.snapshot.parent.url[0].path;
        this.router.navigateByUrl(resourceComponentPath, { skipLocationChange: true }).then(
            () => this.router.navigate([resourceComponentPath, resource.id, 'edit'])
        );
    }

    protected actionsForError(error: any) {
        toastr.error('Ocorreu um erro ao processar sua solicitação');
        if (error.status === 422) {
            this.serverErrorMessage = JSON.parse(error._body).errors;
        } else {
            this.serverErrorMessage = ['Falha na comunicação com servidores', 'Porfavor tente mais tarde'];
        }
        this.submittingForm = false;
    }

    protected creationPageTitle(): string { return 'Novo'; }
    protected editionPageTitle(): string { return 'Editar'; }

    protected abstract buldResourceForm(): void;
}
