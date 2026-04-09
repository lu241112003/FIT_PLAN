import { FormEvent, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { Flame } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

export default function Register() {
  const navigate = useNavigate();
  const { register, isLoading, isAuthenticated } = useAuth();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (senha !== confirmarSenha) {
      setError("As senhas nao coincidem");
      return;
    }

    if (senha.length < 6) {
      setError("A senha deve ter no minimo 6 caracteres");
      return;
    }

    try {
      await register({ nome, email, senha, confirmarSenha });
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao registrar");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-zinc-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border shadow-xl">
        <CardHeader className="space-y-2">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Flame className="w-5 h-5 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Criar conta no FitPlan</CardTitle>
          <p className="text-sm text-muted-foreground">Preencha os dados para comecar.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error ? (
              <div className="rounded-md border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">
                {error}
              </div>
            ) : null}

            <div className="space-y-1">
              <label htmlFor="nome" className="text-sm font-medium">
                Nome
              </label>
              <Input
                id="nome"
                type="text"
                placeholder="Seu nome"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium">
                E-mail
              </label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="senha" className="text-sm font-medium">
                Senha
              </label>
              <Input
                id="senha"
                type="password"
                placeholder="Crie uma senha"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="confirmarSenha" className="text-sm font-medium">
                Confirmar senha
              </label>
              <Input
                id="confirmarSenha"
                type="password"
                placeholder="Repita a senha"
                value={confirmarSenha}
                onChange={(event) => setConfirmarSenha(event.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Registrando..." : "Registrar"}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground mt-4 text-center">
            Ja tem conta?{" "}
            <Link className="text-primary font-medium hover:underline" to="/login">
              Entrar
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
