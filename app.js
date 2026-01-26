
TBL = "dev.silver.tb_aluno"

def esc_sql(s: str) -> str:
    return s.replace("'", "''")

# Comentários por coluna (aplique apenas nas colunas que existirem na tabela)
col_comments = {
    "CD_ALUNO": "Chave de cruzamento do aluno interna (código do banco); identificador único do aluno.",
    "DT_ALTER": "Data e hora da última alteração do cadastro do aluno na origem.",
    "NM_ALUNO_NORMALIZADO": "Nome do aluno normalizado para uso interno (ex.: sem acentos/trim), útil para matching.",
    "NM_ALUNO": "Nome completo do aluno (referência externa/relatórios).",
    "TP_SEXO": "Tipo/código do sexo do aluno conforme domínio da origem.",
    "CD_COR_RACA": "Código de cor/raça do aluno conforme domínio da origem.",
    "FL_IDADE_MIN_ESPEC": "Indicador/flag de idade mínima especial (domínio da origem).",
    "DT_NASCMTO": "Data de nascimento do aluno.",
    "NR_IDADE": "Idade do aluno (conforme regra de cálculo/registro da origem).",
    "DT_FALEC": "Data de falecimento do aluno, quando aplicável.",
    "FL_REFUGIADO": "Flag indicando se o aluno é refugiado.",
    "FL_EMANCIPADO": "Flag indicando se o aluno é emancipado.",
    "ID_IRMAO": "Identificação/indicador relacionado a irmãos do aluno (domínio da origem).",
    "NM_EMAIL": "E-mail do aluno.",
    "NM_FILIAL_1": "Nome da filial 1 (unidade/referência administrativa) associada ao aluno.",
    "NM_FILIAL_2": "Nome da filial 2 (unidade/referência administrativa) associada ao aluno.",
    "NM_FILIAL_3": "Nome da filial 3 (unidade/referência administrativa) associada ao aluno.",
    "ID_BOLSA_FAMILIA": "Identificação/indicador relacionado ao Bolsa Família (domínio da origem).",
    "NR_RA": "Número do Registro do Aluno (RA).",
    "NR_DIG_RA": "Dígito verificador do RA, quando aplicável.",
    "SG_UF_RA": "UF associada ao RA, quando aplicável.",
    "ID_GEMEO": "Identificação/indicador de gêmeo do aluno (domínio da origem).",
    "NR_RNE": "Registro Nacional de Estrangeiro (RNE) do aluno, quando aplicável.",
    "DT_ENTR_BRASIL": "Data de entrada no Brasil, quando aplicável.",
    "CD_NACIONALIDADE": "Código da nacionalidade do aluno conforme domínio da origem.",
    "CD_PAIS_NASC": "Código do país de nascimento do aluno conforme domínio da origem.",
    "NM_CIDADE_NASCMTO": "Cidade de nascimento do aluno.",
    "SG_UF_NASCMTO": "UF de nascimento do aluno.",
    "FL_SIGILO": "Flag de sigilo do cadastro do aluno (privacidade/restrição), conforme origem.",
    "FL_QUILOMBOLA": "Flag indicando se o aluno é quilombola.",
    "INTERNET_CASA": "Indicador de acesso à internet em casa (domínio da origem).",
    "SMART_PESSOAL": "Indicador de smartphone pessoal (domínio da origem).",
    "FL_CIN": "Flag indicando existência/uso de CIN (Carteira de Identidade Nacional), quando aplicável.",
    "NR_CPF": "CPF do aluno (dado pessoal sensível).",
    "NR_RG": "RG do aluno (dado pessoal sensível).",
    "NR_DIG_RG": "Dígito verificador do RG do aluno, quando aplicável.",
    "SG_UF_RG": "UF emissora do RG do aluno, quando aplicável.",
    "NR_RG_MILITAR": "Registro/identificação militar do aluno, quando aplicável.",
    "NR_NIS": "Número do NIS do aluno, quando aplicável.",
    "ID_JUSTIFICATIVA_DOCUMENTO": "Código/identificador de justificativa documental conforme domínio da origem.",
    "NR_CEP": "CEP do endereço residencial do aluno.",
    "NM_ZONA": "Zona do endereço do aluno (ex.: urbana/rural ou classificação da origem).",
    "ID_LOCALIZACAO_DIFERENCIADA": "Identificador/flag de localização diferenciada conforme domínio da origem.",
    "EN_RUA": "Logradouro (rua/avenida etc.) do endereço do aluno.",
    "EN_NR_EN": "Número do endereço do aluno.",
    "EN_COMPLEMTO_EN": "Complemento do endereço do aluno.",
    "NM_BAIRRO": "Bairro do endereço do aluno.",
    "NM_CIDADE": "Cidade do endereço do aluno.",
    "SG_UF": "UF do endereço do aluno.",
    "DS_LATITUDE": "Latitude do endereço do aluno (texto; pode requerer padronização).",
    "DS_LONGITUDE": "Longitude do endereço do aluno (texto; pode requerer padronização).",
    "FL_COMPAT": "Flag de compatibilidade do aluno (regra/domínio da origem).",
    "FL_COMPAT_ALOC": "Flag de compatibilidade para alocação do aluno (regra/domínio da origem).",
    "DT_ANO_REG_NASC": "Data/ano associado ao registro de nascimento (campo da origem).",
    "DT_IMPORT": "Data e hora de importação/carga do lote no lakehouse.",
    "DT_INGESTION": "Data da carga derivada de DT_IMPORT no formato yyyyMMdd (INT).",
    "TP_LIVRO_REG": "Tipo do livro de registro (registro civil) conforme domínio da origem.",
    "NR_LIVRO": "Número do livro do registro civil, quando aplicável.",
    "NR_FOLHA": "Número da folha do registro civil, quando aplicável.",
    "NR_TERMO_REG": "Número do termo do registro civil, quando aplicável.",
    "NR_DIG_CERTIDAO": "Dígito/parte complementar da certidão/registro, quando aplicável.",
    "NR_LIVRO_NASC": "Número do livro de nascimento (registro civil), quando aplicável.",
    "NR_REG_NASC": "Número do registro de nascimento, quando aplicável.",
    "CD_NASC_SERV": "Código do serviço relacionado ao registro de nascimento (domínio da origem).",
    "CD_ACERVO": "Código do acervo/arquivo do registro (domínio da origem).",
    "CD_SERV_REG_CIVIL": "Código do serviço de registro civil (domínio da origem).",
    "TP_FILIAL_1": "Tipo/código da filial 1 conforme domínio da origem.",
    "TP_FILIAL_2": "Tipo/código da filial 2 conforme domínio da origem.",
    "TP_FILIAL_3": "Tipo/código da filial 3 conforme domínio da origem.",
    "NM_SOCIAL": "Nome social do aluno, quando cadastrado.",
    "CD_SIT": "Código de situação do aluno conforme domínio da origem.",
    "CD_LOCAL_DNE": "Código de localidade (DNE/Correios) conforme domínio da origem.",
    "CD_LOGRAD_DNE": "Código de logradouro (DNE/Correios) conforme domínio da origem.",
    "CD_BAIRRO_DNE": "Código de bairro (DNE/Correios) conforme domínio da origem.",
    "DT_INCL": "Data e hora de inclusão do registro na origem.",
    "NM_AFETIVO": "Nome afetivo do aluno, quando cadastrado.",
    "CD_USUARIO": "Identificador do usuário relacionado ao registro (campo operacional da origem).",
    "SEQUENCE": "Sequência do registro na origem (campo operacional).",
    "TP_LOGRAD": "Tipo de logradouro conforme domínio da origem.",
}

# (Opcional) Comentário da tabela
table_comment = (
    "Silver de alunos (snapshot do último SEQUENCE_RAW), com tipagem e colunas documentadas."
)

# Aplica: só comenta o que existir na tabela (evita erro de coluna inexistente)
tgt_cols = set(spark.table(TBL).columns)

applied, skipped = 0, 0
for col, com in col_comments.items():
    if col in tgt_cols:
        spark.sql(
            f"ALTER TABLE {TBL} ALTER COLUMN {col} COMMENT '{esc_sql(com)}'"
        )
        applied += 1
    else:
        skipped += 1

# Comentário da tabela (metastore)
spark.sql(
    f"ALTER TABLE {TBL} SET TBLPROPERTIES ('comment' = '{esc_sql(table_comment)}')"
)

print(f"Comentários aplicados: {applied}")
print(f"Colunas ignoradas (não existem na tabela): {skipped}")
