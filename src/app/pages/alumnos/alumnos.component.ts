import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AlumnosService } from './services/alumnos.service';
import { AlumnoResponse } from 'src/app/shared/models/alumno.interface';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlumnosDialogComponent } from './components/alumnos-dialog/alumnos-dialog.component';
import { DefaultResponse } from 'src/app/shared/models/default.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.component.html',
  styleUrls: ['./alumnos.component.scss']
})
export class AlumnosComponent implements OnInit {
  
  displayedColumns: string[] = ["numero_control", "nombre", "email", "fecha_registro", "actions"];
  alumnos = new MatTableDataSource();
  
  constructor(private alumnoSvc: AlumnosService, 
              private dialog: MatDialog,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.listar();
  }

  listar() {
    this.alumnoSvc.getAlumnos()
      .subscribe( (alumnos: AlumnoResponse[]) => {
        this.alumnos.data = alumnos;
      });
  }

  onOpenModal(alumno: any = {}) {
    const dialogRef = this.dialog.open(AlumnosDialogComponent, {
      minWidth: '60%',
      data: {
        title: 'Registro de Alumnos',
        alumno
      }
    });

    dialogRef.afterClosed().subscribe( (result: DefaultResponse) => {
      if (result) {
        this.snackBar.open(result.mensaje, '', {
          duration: 5 * 1000,
          panelClass: ['success-snackbar'],
          horizontalPosition: 'end',
          verticalPosition: 'top'
        })
        this.listar();
      }
    });
  }

  onDelete(id_alumno: number) {
    Swal.fire({
      title: '',
      text: '¿Realmente desea eliminar el registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'darkBlue',
      cancelButtonColor: 'darkRed',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then( (result) => {
      if (result.isConfirmed) {
        this.alumnoSvc.deleteAlumno(id_alumno).subscribe( (res: DefaultResponse) => {
          this.snackBar.open(res.mensaje, '', {
            duration: 5 * 1000,
            panelClass: ['success-snackbar'],
            horizontalPosition: 'end',
            verticalPosition: 'top'
          })
          this.listar();
        });
      }
    });
  }

}
