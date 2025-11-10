# TODO: Personalizar la visualización del nombre en los sectores según la forma

## Pasos completados:

1. **Modificar la función getCenter en SectorShape.tsx**:
   - ✅ Ajustar la posición del centro para cada tipo de forma:
     - Rectangle: Mantener centro (x + width/2, y + height/2)
     - Circle: Mantener centro (x, y)
     - Semicircle: Posicionar en el centro de la parte plana (x, y + height/2)
     - Arc: Posicionar en el punto medio del arco (aprox. 45 grados)

2. **Ajustar las propiedades del Text component**:
   - ✅ Cambiar align y verticalAlign según la forma para mejor alineación:
     - Rectangle: center, middle
     - Circle: center, middle
     - Semicircle: center, top (para que aparezca en la parte superior de la posición ajustada)
     - Arc: center, middle

3. **Verificar y probar los cambios**:
   - Asegurarse de que el texto se vea bien en cada forma
   - Comprobar que no haya errores en la renderización
