import {
	Toast,
	ToastClose,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
} from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';
import React from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react';

export function Toaster() {
	const { toasts } = useToast();

	const getVariantFromProps = (props) => {
		if (props.variant) return props.variant;
		if (props.destructive || props.variant === 'destructive') return 'destructive';
		// Détecter automatiquement le type de toast selon le titre
		if (props.title) {
			const titleLower = props.title.toLowerCase();
			if (titleLower.includes('erreur') || titleLower.includes('échec') || titleLower.includes('invalide') || titleLower.includes('incorrect')) {
				return 'destructive';
			}
			if (titleLower.includes('succès') || titleLower.includes('réussi') || titleLower.includes('vérifié') || titleLower.includes('envoyé') || titleLower.includes('renvoyé')) {
				return 'success';
			}
		}
		return 'default';
	};

	const getIcon = (variant) => {
		switch (variant) {
			case 'destructive':
				return <XCircle className="w-5 h-5 text-red-400" />;
			case 'success':
				return <CheckCircle2 className="w-5 h-5 text-green-400" />;
			case 'warning':
				return <AlertCircle className="w-5 h-5 text-yellow-400" />;
			default:
				return <Info className="w-5 h-5 text-blue-400" />;
		}
	};

	return (
		<ToastProvider>
			{toasts.map(({ id, title, description, action, dismiss, variant, ...props }) => {
				const toastVariant = getVariantFromProps({ variant, ...props });
				const Icon = getIcon(toastVariant);
				
				return (
					<Toast key={id} variant={toastVariant} {...props}>
						<div className="flex items-start gap-3 flex-1">
							{Icon}
							<div className="grid gap-1 flex-1">
								{title && <ToastTitle className="font-semibold">{title}</ToastTitle>}
								{description && (
									<ToastDescription className="text-sm opacity-90">
										{description}
									</ToastDescription>
								)}
							</div>
						</div>
						{action}
						<ToastClose />
					</Toast>
				);
			})}
			<ToastViewport />
		</ToastProvider>
	);
}
