import { Routes } from '@angular/router';
import { HomeComponent } from './PAGINAS/HOME/home/home.component';
import { PagcadastroclienteComponent } from './PAGINAS/CADASTRO_CLIENTE/pagcadastrocliente/pagcadastrocliente.component';
import { PagconsultaclienteComponent } from './PAGINAS/CONSULTA_CLIENTE/pagconsultacliente/pagconsultacliente.component';
import { PAGALTERACLIENTEComponent } from './PAGINAS/ALTERA_CLIENTE/pag-altera-cliente/pag-altera-cliente.component';
import { PAGCADASTROOSComponent } from './PAGINAS/CADASTRO_OS/pag-cadastro-os/pag-cadastro-os.component';
import { PAGCONSULTAOSComponent } from './PAGINAS/CONSULTA_OS/pag-consulta-os/pag-consulta-os.component';
import { PAGALTERAOSPAG1Component } from './PAGINAS/ALTERA_OS_PAG_1/pag-altera-os-pag1/pag-altera-os-pag1.component';
import { PAGALTERAOSPAG2Component } from './PAGINAS/ALTERA_OS_PAG_2/pag-altera-os-pag2/pag-altera-os-pag2.component';
import { PAGDELETAROSComponent } from './PAGINAS/DELETAR_OS/pag-deletar-os/pag-deletar-os.component';
import { PAGLOTECADOSComponent } from './PAGINAS/LOTE_CADASTRO_OS/pag-lote-cad-os/pag-lote-cad-os.component';
import { PAGIMPRIMEOSLOTEComponent } from './PAGINAS/IMPRIME_OS_LOTE/pag-imprime-os-lote/pag-imprime-os-lote.component';
import { PAGORCAMENTOComponent } from './PAGINAS/ORCAMENTO/pag-orcamento/pag-orcamento.component';
import { PAGRELATORIOSComponent } from './PAGINAS/RELATORIOS/pag-relatorios/pag-relatorios.component';
import { PAGDETALHESComponent } from './PAGINAS/RELATORIOS_DETALHES/pag-detalhes/pag-detalhes.component';
import { PAGPARAMETROSComponent } from './PAGINAS/PARAMETROS/pag-parametros/pag-parametros.component';
import { PAGLOGINEXTERNOComponent } from './PAGINAS/LOGIN_EXTERNO/pag-login-externo/pag-login-externo.component';
import { PAGLOGINLISTAComponent } from './PAGINAS/LOGIN_LISTA/pag-login-lista/pag-login-lista.component';
import { PaginaAnaliseFaturamentoComponent } from './PAGINAS/ANALISE_FATURAMENTO/pag-analise-faturamento/pagina-analise-faturamento.component';
import { PagDespesasComponent } from './PAGINAS/DESPESAS/pag-despesas/pag-despesas.component';
import { PagConsultaDespesaComponent } from './PAGINAS/DESPESAS/pag-consulta-despesa/pag-consulta-despesa.component';
import { PaginaAnaliseDespesaComponent } from './PAGINAS/ANALISE_DESPESA/pag-analise-despesa/pagina-analise-despesa/pagina-analise-despesa.component';

export const routes: Routes = [ 
    {path: '', component: HomeComponent},
    {path: 'home', component: HomeComponent},
    {path:'cliente/cadastro', component: PagcadastroclienteComponent},
    {path:'cliente/consulta', component: PagconsultaclienteComponent},
    { path: 'cliente/altera/:id', component: PAGALTERACLIENTEComponent },
    { path: 'os/cadastro', component: PAGCADASTROOSComponent },
    { path: 'os/consulta', component: PAGCONSULTAOSComponent },
    { path: 'os/consulta/alterapg1/:os', component: PAGALTERAOSPAG1Component },
    { path: 'os/consulta/alterapg2/:os', component: PAGALTERAOSPAG2Component },
    { path: 'os/deletar', component: PAGDELETAROSComponent },
    { path: 'os/lote', component: PAGLOTECADOSComponent },
    { path: 'os/lote/imprime', component: PAGIMPRIMEOSLOTEComponent },
    { path: 'os/orcamento', component: PAGORCAMENTOComponent },
    { path: 'os/relatorio', component: PAGRELATORIOSComponent },
    {path: 'os/relatorio/faturamento', component: PaginaAnaliseFaturamentoComponent},
    {path: 'os/relatorio/despesa', component: PaginaAnaliseDespesaComponent},
    { path: 'os/relatorio/detalhes/:variavelEnviada/:dataInicio/:dataFim',component: PAGDETALHESComponent},
    { path: 'parametros',component: PAGPARAMETROSComponent},
    { path: 'login',component: PAGLOGINEXTERNOComponent},
    { path: 'login/lista/:codcli',component: PAGLOGINLISTAComponent},
    { path: 'despesa/cadastro',component: PagDespesasComponent},
    { path: 'despesa/consulta',component: PagConsultaDespesaComponent},
    
];
