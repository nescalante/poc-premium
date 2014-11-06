#[Download POC](https://github.com/nescalante/poc-premium/archive/master.zip)

Mostrar una grilla que representan los meses del año (3 x 4), en cada celda hay que poder agregar elementos de tipo Price Method. 
Esos elementos de Price Method pueden ser de 3 tipos:
Flat Fee. Cuando el elemento es de este tipo, solo hay que cargar cual es el monto del Fee.
Revenue Share. Cuando el elemento es de este tipo, solo hay que cargar el % de share.
Suscribers. Si es de este tipo, hay que configurar dos parámetros, un Checkbox y una tabla que indica rangos y montos. Ejemplo (1 a 10 -> $100, 11 a 50 -> $80) El rango puede ser 1 a infinito. El checkbox determina como se procesa el rango si es incremental o no, debería decir "Incremental"

Se pueden agregar más de un elemento en una celda y cuando eso ocurre, y hay dos elementos, se habilita una sección lateral izquierda que permita establecer cómo se combinan los elementos, existen dos formas (Mayor o Menor).

En otra tabla de características similares, se utiliza para comprobar el funcionamiento de la configuración antes creada. La tabla debe ser similar y debe tener la misma estructura, aunque cada elemento debe tener un comprortamiento diferente:
Flat Fee. Solo debe mostrar un total en el margen inferior derecho.
Revenue Share. Debe permitir cargar la cantidad de suscriptores y el Retail Price. Una vez cargados estos valores deben ser copiados a todos los otros elementos que tengan estos valores (atención que la cant de suscriptores está en dos tipos de elementos)
Suscribers. Debe permitir establecer la cantidad de suscriptores y debe copiar este valor a todos los elementos siguientes.

Todos los elementos deben mostrar un total en el margen inferior derecho que se calcula de la siguiente forma:
Flat Fee. El precio establecido en el flat fee de la primera tabla.
Revenue Share. Total = Retail Price * Rev Share (de la tabla anterior) * Cant Suscriptores
Suscribers. Total = Cant Suscriptores * Precio (segun la tabla). Atención de aplicar el flag de incremental.
Atención a los meses en los cuales haya más de un elemento y la combinación se determina en función de (mayor o menor) el precio que ha entregado cada elemento.
