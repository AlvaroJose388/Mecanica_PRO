'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';
import { PageHeader } from './page-header';

interface UpgradeToPremiumProps {
    featureName: string;
}

export function UpgradeToPremium({ featureName }: UpgradeToPremiumProps) {
  return (
    <div>
        <PageHeader 
            title={featureName}
            description={`Desbloquea esta función y más con nuestro Plan Premium.`}
        />
        <Card className="text-center">
            <CardHeader>
                <div className="mx-auto bg-primary text-primary-foreground rounded-full h-12 w-12 flex items-center justify-center mb-4">
                    <Sparkles className="h-6 w-6" />
                </div>
                <CardTitle>Mejora a Premium</CardTitle>
                <CardDescription>
                    La función de {featureName.toLowerCase()} solo está disponible para suscriptores del Plan Premium.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="mb-6 text-muted-foreground">
                    Obtén acceso a herramientas avanzadas como análisis detallados, chat integrado, asistencia con IA y más para llevar la gestión de tu taller al siguiente nivel.
                </p>
                <Button size="lg">
                    Ver Planes y Precios
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
