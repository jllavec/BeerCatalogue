# prueba-codigo

## Instalación de las dependencias del proyecto
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```
## Solución propuesta

Se ha desarrollado en Vue. Y la estructura de carpetas sería más o menos la misma que seguiría un proyecto de este tipo: 
* assets: Todos los recursos multimedia del proyecto. Imágenes y fuentes
* components: Aquí estan los componentes que se utilizan en la aplicación
* helpers: Funciones que pueden ser reutilizables para parsear datos
* http: Aquí se guarda la instancia de axios para realizar llamadas al api
* services: Se generan diferentes servicios para llamar al api. Se crean en formato de class de JS para que sean más fácilmente documentables, accesibles y modularizables
* styles: Se guardan los estilos troncales de la aplicación. Se ha utilizado SASS para la prueba y aquí también se almacenan las variables y mixins. Además se ha utilizado un plugin que hace que resuelva todas estas variables / mixins transversalmente a todos los componentes.

Se podría haber utilizado un store, Vuex en este caso, pero decidí almacenar los estados en el mismo fichero de aplicación (App.vue), y que los componentes se comuniquen con eventos / props. Para un proyecto sencillo, no siempre añadir un store es la solución más óptima. En este caso decidí no hacerlo.

Para realizar las llamadas al api se utiliza Axios, encapsulado para que se pueda importar desde cualquier parte si se quisieran definir más servicios. No hubiera sido necesario ya que únicamente ataco a un endpoint y solamente cambio los parametros, ha sido totalmente para mostrar como sería en un proyecto real.

La caja de búsqueda permite buscar nombre y fecha a la vez, y se comprueba con dos Regex cada tipo, se pueden meter tantos términos como se desee, y se parametriza de tal manera que le lleguen al servicio en el formato esperado para realizar la llamada al API. Se hace en un watcher, comprobando ciertamente que se trata de algo que permite la búsqueda, y limpiando los estados en el caso de que hayan cambiado los parámetros de búsqueda. Este watcher lleva un debounce para evitar llamadas al API cada vez que se pulsa una tecla, de esta manera conseguimos consumir el api de manera más eficiente y únicamente se llama a la misma cuando el usuario ha parado de escribir durante 500ms.

El paginador funciona de manera similar, pero solo teniendo en cuenta la propiedad page. Si hubiera parámetros de búsqueda, los utiliza para seguir paginando en caso de que así se requiera. Únicamente se muestra el paginador si es necesario, si la lista tiene 25 elementos o no se quiere mostrar la lista de favoritos.

A la hora de mostrar el listado de cervezas, es el componente lista el que recibe el array de como prop y se encarga de mostrarlas. Este tiene dos botones en la parte superior, uno que permite mostrar la lista como una galería, la cual se ha hecho con grid o como una lista. El otro botón, permite ver la lista de favoritos que ha seleccionado el usuario.

Si se pulsa sobre las cajas, se despliega un modal que muestra los datos que se requieren. Se ha mapeado con un reduces el objeto de ingredientes, de una manera un tanto enrevesada, pero que me parecía que quedaba bien a nivel frontal, para procesar esos datos y renderizarlos. El modal se cierra cuando se pulsa fuera del mismo.

Para guardar las cervezas en favoritos, se puede pulsar el icono de la estrella, la cual queda marcada cuando estos están como favoritos. Para que persistan, se emite un evento al padre para que almacene / elimine ese elemento y poder mostrarlo después, o en cualquiera de las búsquedas, pueda aparecer como que ya estaba marcado como favorito, ya que desde el padre, se retoca la lista de cervezas que llega del API mediante una computada, la cual enriquece esa lista con la propiedad isFav. Para poder ver la lista de favoritos únicamente, al pulsar sobre el botón Show Favs, se muestra este listado. Como ya había varios ejemplos en el que se realizan llamadas combinadas entre terminos de búsqueda y paginado, me pareció buena idea hacerlo sin llamada al API y que persistan en la aplicación. Pero se podría haber implementado según el api, combinando todos los parametros adicionales y mapeando esos id para poder obtener el listado de favoritos de ahí directamente, sin necesidad de guardarlos en la aplicación totalmente.

Se han realizado test unitarios únicamente en la App, ya que a mi modo de ver es la parte más compleja.

Creo que con esto, se explican el grueso de las decisiones que he tomado a la hora de realizar la prueba y en la revisión de la misma podremos comentar más cosas.

Muchas gracias por vuestro tiempo y por la oportunidad! Un saludo!

