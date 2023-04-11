import { Injectable } from "@angular/core";
import { AbstractControl } from "@angular/forms";

@Injectable({ providedIn: 'root'})
export class BaseForm {

    constructor() { }

    isvalidField(form: AbstractControl|null) {
        var flag = false;

        if (form) 
            flag = form.touched || form.dirty && !form.valid;

        return flag;
    }

    getErrorMessage(form: AbstractControl|null) {
        let message = "";

        if (form) {
            const { errors } = form;
            if (errors) {
                const messages: any = {
                    required: 'campo requerido',
                    email: 'Formato inválido',
                    pattern: 'Formato inválido',
                    min: 'El rango no es correcto',
                    max: 'El rango no es correcto',
                    minlength: 'Formato inválido'
                }

                const errorKey = Object.keys(errors).find(Boolean);
                if (errorKey) {
                    message = messages[errorKey];
                }
            }
        }
        return message;
    }

}