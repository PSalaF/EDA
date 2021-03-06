import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertService, DashboardService, GroupService} from '@eda/services/service.index';
import {EdaDialog, EdaDialogCloseEvent, EdaDialogAbstract} from '@eda/shared/components/shared-components.index';
import {IGroup} from '@eda/services/api/group.service';
import {SelectItem} from 'primeng/api';

@Component({
    selector: 'app-add-dashboard',
    templateUrl: './add-dashboard.component.html'
})

export class AddDashboardComponent extends EdaDialogAbstract {
    public dialog: EdaDialog;
    public form: FormGroup;
    public dss: any[] = [];
    public grups: IGroup[] = [];
    public visibleTypes: SelectItem[] = [];
    public display = {
        groups: false
    };

    constructor( private dashboardService: DashboardService,
                 private groupService: GroupService,
                 private formBuilder: FormBuilder,
                 private alertService: AlertService ) {
        super();
        this.initializeDialog();
        this.initializeForm();

    }

    onShow(): void {
       this.initialize();
    }

    initializeDialog(): void {
        this.dialog = new EdaDialog({
            show: () => this.onShow(),
            hide: () => this.onClose(EdaDialogCloseEvent.NONE),
            style: {height: '50%', width: '60%'},
            title: 'CREA TU NUEVO INFORME'
        });
    }

    initializeForm(): void {
        this.form = this.formBuilder.group({
            name: [null, Validators.required],
            ds: [null, Validators.required],
            visible: [null, Validators.required],
            group: [null]
        });

        this.visibleTypes = [
            {label: 'Público',  value: 'public',  icon: 'fa fa-fw fa-globe'},
            {label: 'Grupo',    value: 'group',   icon: 'fa fa-fw fa-users'},
            {label: 'Privado',  value: 'private', icon: 'fa fa-fw fa-lock'},
        ];

        this.form.controls['visible'].setValue(this.visibleTypes[2].value);

    }

    initialize(): void {
        this.dss = this.controller.params.dataSources;

        this.groupService.getGroupsByUser().subscribe(
            res => {
                this.grups = res;

                if (this.grups.length === 0) {
                    this.visibleTypes.splice(1, 1);
                }
            },
            err => this.alertService.addError(err)
        );
    }

    handleSelectedBtn(event): void {
        const groupControl = this.form.get('group');
        this.display.groups = event.value === 'group';

        if (this.display.groups) {
            groupControl.setValidators(Validators.required);
        }

        if (!this.display.groups) {

            groupControl.setValidators(null);
            groupControl.setValue(null);
        }

    }

    createNewDashboard(): void {
        if (this.form.invalid) {
            this.alertService.addError('Recuerde rellenar los campos obligatorios');
        } else {
            const ds = { _id: this.form.value.ds._id };
            const body = {
                config: {title: this.form.value.name, visible: this.form.value.visible, ds},
                group: this.form.value.group ? this.form.value.group._id : undefined
            };

            this.dashboardService.addNewDashboard(body).subscribe(
                r => this.onClose(EdaDialogCloseEvent.NEW, r.dashboard),
                err => this.alertService.addError(err)
            );
        }
    }

    closeDialog():void {
        this.form.reset();
        this.onClose(EdaDialogCloseEvent.NONE);
    }

    onClose(event: EdaDialogCloseEvent, response?: any): void {
        this.controller.close(event, response);
    }

}
