import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfessionalProfile } from '../../../models/professional.model';

@Component({
  selector: 'app-professional-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="profile">
      <div class="hero">
        <img class="avatar" src="https://i.pravatar.cc/120?img=12" alt="Foto" />
        <div class="hero-info">
          <h2 class="name">{{ profile?.name || 'Profesional' }}</h2>
          <div class="subtitle">{{ profile?.specialty || 'Especialidad' }}</div>
          <p class="summary">{{ profile?.description || 'Descripción del profesional.' }}</p>
          <div class="location">{{ profile?.location || 'Córdoba, Argentina' }}</div>
        </div>
        <div class="hero-actions">
          <button class="btn primary">Ver perfil Profesional</button>
          <button class="link">Reportar perfil</button>
        </div>
      </div>

      <div class="grid">
        <div class="card">
          <h3>Datos Personales</h3>
          <div class="list">
            <div class="row"><span>DNI</span><strong>30555892</strong></div>
            <div class="row"><span>Correo</span><strong>carlos.el&#64;example.com</strong></div>
            <div class="row"><span>Teléfono</span><strong>+54 9 351 456 8980</strong></div>
            <div class="row"><span>Registrado el</span><strong>12/08/2019</strong></div>
            <div class="row"><span>Estado</span><strong>Activo</strong></div>
            <div class="row"><span>Disponibilidad</span><strong>Inmediata</strong></div>
            <div class="row"><span>Experiencia</span><strong>+12 años</strong></div>
          </div>
        </div>

        <div class="card">
          <h3>Especialidades</h3>
          <div class="chips">
            <span class="chip">Instalaciones eléctricas</span>
            <span class="chip">Tableros trifásicos</span>
            <span class="chip">Domótica</span>
          </div>
          <h3>Valoraciones y comentarios</h3>
          <div class="rating">★★★★★ <strong>4,9</strong> (23)</div>
          <div class="comment">
            <img class="mini" src="https://i.pravatar.cc/40?img=5" alt="" />
            <div>Muy prolijo, explicó todo, lo recomiendo.</div>
          </div>
          <div class="comment">
            <img class="mini" src="https://i.pravatar.cc/40?img=15" alt="" />
            <div>Detectó un problema que nadie resolvía.</div>
          </div>
        </div>

        <div class="card">
          <h3>Últimos Trabajos</h3>
          <div class="work">
            <img src="https://picsum.photos/seed/e1/320/160" alt="Trabajo" />
            <div>
              <div class="work-title">Renovación eléctrica en vivienda antigua</div>
              <div class="work-meta">Córdoba Capital · Abr. 2024</div>
            </div>
          </div>
          <div class="work">
            <img src="https://picsum.photos/seed/e2/320/160" alt="Trabajo" />
            <div>
              <div class="work-title">Automatización de luminarias</div>
              <div class="work-meta">Alta Gracia · Feb. 2024</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .profile { display: grid; gap: 1.25rem; }
    .hero { display: grid; grid-template-columns: 120px 1fr auto; align-items: center; gap: 1.25rem; background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 1rem; }
    .avatar { width: 120px; height: 120px; object-fit: cover; border-radius: 12px; }
    .name { margin: 0; font-size: 1.8rem; }
    .subtitle { color: #475569; margin-top: 0.25rem; }
    .summary { color: #334155; margin: 0.5rem 0; }
    .location { color: #475569; }
    .hero-actions { display: grid; gap: 0.5rem; justify-items: end; }
    .btn { height: 40px; padding: 0 0.9rem; border: 1px solid transparent; border-radius: 10px; cursor: pointer; font-weight: 600; }
    .btn.primary { background: #1f4c85; color: #fff; }
    .link { background: transparent; border: none; color: #1f4c85; cursor: pointer; }

    .grid { display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 1rem; }
    .card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 1rem; }
    h3 { margin: 0.25rem 0 0.75rem; font-size: 1.1rem; }
    .list { display: grid; gap: 0.5rem; }
    .row { display: grid; grid-template-columns: 1fr auto; gap: 1rem; border-bottom: 1px solid #f1f5f9; padding-bottom: 0.5rem; }
    .chips { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem; }
    .chip { background: #eef2f7; color: #1f2937; padding: 0.25rem 0.6rem; border-radius: 9999px; font-size: 0.85rem; }
    .rating { color: #111827; margin-bottom: 0.5rem; }
    .comment { display: grid; grid-template-columns: 40px 1fr; gap: 0.5rem; align-items: center; }
    .mini { width: 40px; height: 40px; border-radius: 9999px; }
    .work { display: grid; grid-template-columns: 120px 1fr; gap: 0.75rem; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid #f1f5f9; }
    .work img { width: 120px; height: 64px; object-fit: cover; border-radius: 8px; }
    .work-title { font-weight: 600; }
    .work-meta { color: #64748b; font-size: 0.9rem; }

    @media (max-width: 1024px) {
      .hero { grid-template-columns: 80px 1fr; }
      .hero-actions { justify-items: start; grid-column: 1 / -1; }
      .avatar { width: 80px; height: 80px; }
      .grid { grid-template-columns: 1fr; }
    }
  `]
})
export class ProfessionalDetailComponent {
  @Input() profile?: ProfessionalProfile;
}


