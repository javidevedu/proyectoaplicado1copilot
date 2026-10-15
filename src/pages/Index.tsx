import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, LogIn, UserPlus, Sparkles, AlertTriangle, BarChart3 } from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="container mx-auto px-4 py-20 text-center max-w-3xl">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-6">
          <BookOpen className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
          LantestAI
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
          Plataforma para docentes: crea evaluaciones de inglés con IA, compártelas con tus estudiantes y revisa los resultados automáticamente.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button size="lg" onClick={() => navigate('/admin/register')}>
            <UserPlus className="w-4 h-4 mr-2" /> Registrarse
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/admin/login')}>
            <LogIn className="w-4 h-4 mr-2" /> Iniciar sesión
          </Button>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 pb-20 max-w-4xl">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Sparkles, title: 'Generación con IA', desc: 'Genera preguntas automáticamente: reading, listening, writing y speaking calibradas al nivel MCER.' },
            { icon: AlertTriangle, title: 'Anti-fraude', desc: 'Modo pantalla completa, detección de cambio de pestaña y cierre automático para mantener la integridad académica.' },
            { icon: BarChart3, title: 'Resultados', desc: 'Consulta los resultados de tus estudiantes, exporta a CSV y revisa la retroalimentación del writing.' },
          ].map((f, i) => (
            <Card key={i} className="glass-card">
              <CardContent className="py-6 text-center space-y-3">
                <f.icon className="w-8 h-8 mx-auto text-primary" />
                <h3 className="font-heading font-bold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
