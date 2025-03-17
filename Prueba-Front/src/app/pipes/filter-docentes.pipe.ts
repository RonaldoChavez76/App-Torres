import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterDocentes'
})
export class FilterDocentesPipe implements PipeTransform {
  transform(docentes: any[], filtro: string): any[] {
    if (!docentes) {
      console.log("No hay docentes en la lista.");
      return [];
    }
    if (!filtro) {
      return docentes;
    }

    console.log("Filtrando con:", filtro);
    const resultado = docentes.filter(docente =>
      docente.nombre.toLowerCase().includes(filtro.toLowerCase())
    );
    
    console.log("Resultado del filtro:", resultado);
    return resultado;
  }
}
