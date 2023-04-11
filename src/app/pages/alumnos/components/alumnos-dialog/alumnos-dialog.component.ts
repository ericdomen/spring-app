import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseForm } from 'src/app/shared/utils/base-form';
import { AlumnosService } from '../../services/alumnos.service';
import { AlumnoResponse } from 'src/app/shared/models/alumno.interface';

enum Action {
  EDIT = 'edit',
  NEW = 'new'
}

@Component({
  selector: 'app-alumnos-dialog',
  templateUrl: './alumnos-dialog.component.html',
  styleUrls: ['./alumnos-dialog.component.scss']
})
export class AlumnosDialogComponent implements OnInit {
  
  actionTODO = Action.NEW;
  titleButton = "Guardar";
  alumnoForm = this.fb.group({
    id_alumno: [''],
    nombre: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    numero_control: ['', [Validators.required]],
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<AlumnosDialogComponent>,
              private fb: FormBuilder,
              public baseForm: BaseForm,
              private alumnoSvc: AlumnosService) {}

  ngOnInit(): void {
    this.pathData();
  }

  onSave() {
    if (this.alumnoForm.invalid) return;

    const formValues = this.alumnoForm.getRawValue();

    if (this.actionTODO == Action.NEW) {
      var newAlumno: AlumnoResponse = {
        email: formValues.email ? formValues.email : '',
        nombre: formValues.nombre ? formValues.nombre : '',
        numero_control: formValues.numero_control ? formValues.numero_control : '',
      }

      this.alumnoSvc.newAlumno(newAlumno).subscribe(result => {
        this.dialogRef.close(result);
      });
    } else {
      var updateUser: AlumnoResponse = {
        id_alumno: formValues.id_alumno ? parseInt(formValues.id_alumno) : 0,
        email: formValues.email ? formValues.email : '',
        nombre: formValues.nombre ? formValues.nombre : '',
        numero_control: formValues.numero_control ? formValues.numero_control : '',
      }

      this.alumnoSvc.updateAlumno(updateUser).subscribe(result => {
        this.dialogRef.close(result);
      });

    }
  }

  pathData() {
    if(this.data.alumno.id_alumno) {
      this.actionTODO = Action.EDIT;
      this.titleButton = "Editar";
      this.alumnoForm.patchValue({
        id_alumno: this.data.alumno?.id_alumno,
        nombre: this.data.alumno?.nombre,
        email: this.data.alumno?.email,
        numero_control: this.data.alumno?.numero_control
      });

      this.alumnoForm.updateValueAndValidity();
    }
  }

  onClear() {
    this.alumnoForm.reset();
  }

}
