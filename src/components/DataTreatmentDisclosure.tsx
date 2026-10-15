export function DataTreatmentDisclosure() {
  return (
    <div className="space-y-2 text-xs text-muted-foreground">
      <p>Al continuar en este sitio web, acepta la política de tratamiento de datos.</p>
      <details className="rounded-md border px-3 py-2">
        <summary className="cursor-pointer font-medium text-foreground">
          Política de tratamiento de datos
        </summary>
        <p className="mt-2 leading-relaxed">
          Al realizar esta prueba, sus datos personales (nombre, número de identificación, género,
          correo electrónico, registro de acceso y respuestas) serán tratados conforme a la Ley
          1581 de 2012 y demás normas aplicables, con fines académicos. Para apoyar la revisión,
          calificación y retroalimentación, podrían utilizarse otras herramientas tecnológicas de
          apoyo.
        </p>
      </details>
    </div>
  );
}
