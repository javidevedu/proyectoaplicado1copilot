import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { DataTreatmentDisclosure } from '@/components/DataTreatmentDisclosure';

const schema = z.object({
  name: z.string().trim().min(2, 'Nombre demasiado corto').max(80),
  email: z.string().trim().email('Correo inválido').max(255),
  password: z.string().min(6, 'Mínimo 6 caracteres').max(72),
});

export default function AdminRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ name, email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await signUp(parsed.data.email, parsed.data.password, parsed.data.name);
    if (error) {
      setLoading(false);
      if (error.toLowerCase().includes('registered')) {
        toast.error('Ese correo ya está registrado');
      } else {
        toast.error(error);
      }
      return;
    }
    // Auto-login after signup
    const { error: signInError } = await signIn(parsed.data.email, parsed.data.password);
    setLoading(false);
    if (signInError) {
      toast.success('Cuenta creada. Inicia sesión.');
      navigate('/admin/login');
    } else {
      toast.success(`¡Bienvenido, ${parsed.data.name}!`);
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md glass-card">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-2">
            <UserPlus className="w-7 h-7 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-heading">Registro de docente</CardTitle>
          <CardDescription>Crea tu cuenta para empezar a diseñar evaluaciones</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Ana Martínez" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="docente@ejemplo.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              <UserPlus className="w-4 h-4 mr-2" />
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              ¿Ya tienes cuenta?{' '}
              <Link to="/admin/login" className="text-primary hover:underline">
                Inicia sesión
              </Link>
            </p>
          </form>
          <div className="mt-4">
            <DataTreatmentDisclosure />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
