// Festivos fijos y móviles en Colombia (Ley 51 de 1983)
const FESTIVOS_FIJOS: Record<string, string> = {
  '0101': 'Año Nuevo',
  '0105': 'Reyes',
  '0501': 'Día del Trabajo',
  '1101': 'Todos los Santos',
  '1108': 'Inmaculada Concepción',
  '1225': 'Navidad',
};

export class CalculadorDiasHabiles {
  private festivos: Map<number, Date[]> = new Map();

  constructor() {
    this.cargarFestivos();
  }

  private cargarFestivos() {
    for (let year = 2024; year <= 2030; year++) {
      const festivos: Date[] = [];

      // Fijos
      Object.entries(FESTIVOS_FIJOS).forEach(([mmdd, _]) => {
        const [mm, dd] = [parseInt(mmdd.substring(0, 2)), parseInt(mmdd.substring(2))];
        festivos.push(new Date(year, mm - 1, dd));
      });

      // Móviles (Pascua)
      const pascua = this.calcularPascua(year);
      festivos.push(new Date(pascua.getTime() - 3 * 24 * 60 * 60 * 1000)); // Jueves Santo
      festivos.push(new Date(pascua.getTime() - 2 * 24 * 60 * 60 * 1000)); // Viernes Santo

      this.festivos.set(year, festivos);
    }
  }

  private calcularPascua(year: number): Date {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month, day);
  }

  esFestivo(fecha: Date): boolean {
    const year = fecha.getFullYear();
    const festivos = this.festivos.get(year);
    if (!festivos) return false;

    return festivos.some(
      (f) => f.getDate() === fecha.getDate() && f.getMonth() === fecha.getMonth()
    );
  }

  esFinDeSemana(fecha: Date): boolean {
    return fecha.getDay() === 0 || fecha.getDay() === 6;
  }

  esHabil(fecha: Date): boolean {
    return !this.esFinDeSemana(fecha) && !this.esFestivo(fecha);
  }

  sumarDiasHabiles(fecha: Date, dias: number): Date {
    const resultado = new Date(fecha);
    let contador = 0;

    while (contador < dias) {
      resultado.setDate(resultado.getDate() + 1);
      if (this.esHabil(resultado)) {
        contador++;
      }
    }

    return resultado;
  }

  diasHabilesEntre(inicio: Date, fin: Date): number {
    let contador = 0;
    const fecha = new Date(inicio);

    while (fecha < fin) {
      fecha.setDate(fecha.getDate() + 1);
      if (this.esHabil(fecha)) {
        contador++;
      }
    }

    return contador;
  }

  diasRestantes(vencimiento: Date): number {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    vencimiento.setHours(0, 0, 0, 0);

    if (vencimiento < hoy) return -1;
    return this.diasHabilesEntre(hoy, vencimiento);
  }

  calcularSemaforo(diasRestantes: number): 'verde' | 'ambar' | 'rojo' | 'vencido' {
    if (diasRestantes < 0) return 'vencido';
    if (diasRestantes <= 2) return 'rojo';
    if (diasRestantes <= 5) return 'ambar';
    return 'verde';
  }
}

export const calculador = new CalculadorDiasHabiles();

export function habilesRestantes(vencimiento: Date): number {
  return calculador.diasRestantes(vencimiento);
}

export function calcularSemaforo(diasRestantes: number): 'verde' | 'ambar' | 'rojo' | 'vencido' {
  return calculador.calcularSemaforo(diasRestantes);
}

export function formatearFecha(fecha: Date): string {
  return fecha.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
