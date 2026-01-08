import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface TermsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAccept?: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, onAccept }) => {
    const handleAccept = () => {
        if (onAccept) {
            onAccept();
        }
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Termini e Condizioni"
            width="lg"
            showCloseButton={true}
        >
            <div className="p-6 space-y-6">
                {/* Contenuto scrollabile */}
                <div className="max-h-[60vh] overflow-y-auto space-y-4 text-sm text-[var(--color-text-main)] pr-2">
                    <section>
                        <h3 className="font-bold text-base mb-2">1. Accettazione dei Termini</h3>
                        <p className="text-[var(--color-text-muted)] leading-relaxed">
                            Utilizzando il servizio Armonyco, accetti integralmente i presenti Termini e Condizioni.
                            Se non accetti questi termini, non potrai utilizzare i nostri servizi.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-bold text-base mb-2">2. Descrizione del Servizio</h3>
                        <p className="text-[var(--color-text-muted)] leading-relaxed">
                            Armonyco è una piattaforma SaaS B2B che fornisce strumenti di gestione decisionale
                            e automazione per le aziende. Il servizio include accesso a moduli AI, dashboard
                            di analytics, e strumenti di compliance.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-bold text-base mb-2">3. Registrazione e Account</h3>
                        <ul className="list-disc list-inside space-y-2 text-[var(--color-text-muted)]">
                            <li>Devi fornire informazioni accurate e complete durante la registrazione</li>
                            <li>Sei responsabile della sicurezza delle tue credenziali di accesso</li>
                            <li>Non puoi condividere il tuo account con terzi non autorizzati</li>
                            <li>Devi notificarci immediatamente in caso di accesso non autorizzato</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="font-bold text-base mb-2">4. Piani e Pagamenti</h3>
                        <ul className="list-disc list-inside space-y-2 text-[var(--color-text-muted)]">
                            <li>I pagamenti sono elaborati tramite Stripe e sono soggetti alle loro politiche</li>
                            <li>I crediti acquistati sono validi per il periodo specificato nel piano</li>
                            <li>I crediti non utilizzati non sono rimborsabili</li>
                            <li>I prezzi possono variare previa comunicazione con almeno 30 giorni di anticipo</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="font-bold text-base mb-2">5. Utilizzo del Servizio</h3>
                        <ul className="list-disc list-inside space-y-2 text-[var(--color-text-muted)]">
                            <li>Accetti di utilizzare il servizio in conformità con tutte le leggi applicabili</li>
                            <li>Non puoi utilizzare il servizio per attività illegali o non autorizzate</li>
                            <li>Non puoi tentare di violare la sicurezza della piattaforma</li>
                            <li>Non puoi fare reverse engineering del software</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="font-bold text-base mb-2">6. Proprietà Intellettuale</h3>
                        <p className="text-[var(--color-text-muted)] leading-relaxed">
                            Tutti i diritti di proprietà intellettuale relativi alla piattaforma Armonyco
                            appartengono a noi o ai nostri licenzianti. I tuoi dati rimangono di tua proprietà,
                            ma ci concedi una licenza per utilizzarli per fornirti il servizio.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-bold text-base mb-2">7. Privacy e Dati</h3>
                        <p className="text-[var(--color-text-muted)] leading-relaxed">
                            Il trattamento dei tuoi dati personali è regolato dalla nostra Privacy Policy,
                            conforme al GDPR. Trattiamo i dati con la massima sicurezza e non li vendiamo
                            a terze parti.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-bold text-base mb-2">8. Limitazione di Responsabilità</h3>
                        <p className="text-[var(--color-text-muted)] leading-relaxed">
                            Il servizio è fornito "così com'è" senza garanzie di alcun tipo. Non siamo
                            responsabili per danni indiretti, incidentali o consequenziali derivanti
                            dall'uso del servizio.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-bold text-base mb-2">9. Risoluzione e Cancellazione</h3>
                        <ul className="list-disc list-inside space-y-2 text-[var(--color-text-muted)]">
                            <li>Puoi cancellare il tuo account in qualsiasi momento dalle impostazioni</li>
                            <li>Possiamo sospendere o terminare l'account in caso di violazione dei termini</li>
                            <li>I dati vengono conservati secondo la nostra retention policy</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="font-bold text-base mb-2">10. Modifiche ai Termini</h3>
                        <p className="text-[var(--color-text-muted)] leading-relaxed">
                            Ci riserviamo il diritto di modificare questi termini in qualsiasi momento.
                            Le modifiche saranno comunicate via email e pubblicate sulla piattaforma.
                            L'uso continuato del servizio costituisce accettazione delle modifiche.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-bold text-base mb-2">11. Legge Applicabile</h3>
                        <p className="text-[var(--color-text-muted)] leading-relaxed">
                            Questi termini sono regolati dalla legge italiana. Eventuali controversie
                            saranno di competenza esclusiva del Foro di Milano.
                        </p>
                    </section>

                    <section className="pt-4 border-t border-[var(--color-border)]">
                        <p className="text-xs text-[var(--color-text-muted)] italic">
                            Ultimo aggiornamento: Gennaio 2026
                        </p>
                    </section>
                </div>

                {/* Footer con azioni */}
                <div className="flex gap-3 pt-4 border-t border-[var(--color-border)]">
                    {onAccept && (
                        <Button
                            variant="primary"
                            onClick={handleAccept}
                            className="flex-1"
                        >
                            Accetto i Termini
                        </Button>
                    )}
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        className={onAccept ? 'flex-1' : 'w-full'}
                    >
                        {onAccept ? 'Rifiuta' : 'Chiudi'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

