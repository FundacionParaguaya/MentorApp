export default s = [
    {
      title: 'Argentina - Fundación Irradia',
      id: 10,
      minimumPriorities: 0,
      privacyPolicy: {
        title: null,
        text: null
      },
      termsConditions: {
        title: null,
        text: null
      },
      surveyConfig: {
        documentType: [
          {
            text: 'Pasaporte',
            value: 'PASAPORTE'
          },
          {
            text: 'Licencia de conducir',
            value: 'LICENCIA_DE_CONDUCIR'
          },
          {
            text: 'Documento Nacional de Identidad',
            value: 'DOCUMENTO_NACIONAL_DE_IDENTIDAD'
          },
          {
            text: 'Tarjeta de Identificación del Estado',
            value: 'TARJETA_DE_IDENTIFICACION_DEL_ESTADO'
          },
          {
            text: 'Número de tarjeta de residente permanente',
            value: 'TARJETA_DE_RESIDENTE_PERMANENTE'
          },
          {
            text: 'Número asignado por la organización',
            value: 'NUMERO_ASIGNADO_POR_LA_ORGANIZACION'
          }
        ],
        gender: [
          {
            text: 'Masculino',
            value: 'M'
          },
          {
            text: 'Femenino',
            value: 'F'
          },
          {
            text: 'Otro',
            value: 'O'
          },
          {
            text: 'Prefiero no especificar',
            value: 'N'
          }
        ],
        surveyLocation: {
          country: 'AR',
          latitude: 34.605849,
          longitude: -58.384544
        }
      },
      surveyEconomicQuestions: [
        {
          questionText: 'Ingrese la zona en que vive',
          codeName: 'areaOfResidence',
          answerType: 'select',
          topic: 'Datos de la familia',
          required: true,
          forFamilyMember: false,
          options: [
            {
              text: 'Urbana',
              value: 'URBANA'
            },
            {
              text: 'Rural',
              value: 'RURAL'
            }
          ],
          conditions: []
        },
        {
          questionText: 'Situación de la vivienda',
          codeName: 'housingSituation',
          answerType: 'select',
          topic: 'Datos de la familia',
          required: false,
          forFamilyMember: false,
          options: [
            {
              text: 'Propia con título',
              value: 'PROPIA_CON_TITULO'
            },
            {
              text: 'Propia sin título',
              value: 'PROPIA_SIN_TITULO'
            },
            {
              text: 'En propiedad familiar',
              value: 'PROPIEDAD_FAMILIAR'
            },
            {
              text: 'Alquilada',
              value: 'ALQUILADA'
            },
            {
              text: 'Prestada',
              value: 'PRESTADA'
            },
            {
              text: 'Prefiero no decir',
              value: 'PREFIERO_NO_RESPONDER'
            }
          ],
          conditions: [
            {
              codeName: 'areaOfResidence',
              type: 'socioEconomic',
              value: 'URBANA',
              operator: 'equals'
            }
          ]
        },
        {
          questionText: '¿En nuestra casa hay algún miembro con discapacidad?',
          codeName: 'memberDisability',
          answerType: 'select',
          topic: 'Datos de la familia',
          required: false,
          forFamilyMember: false,
          options: [
            {
              text: 'Física',
              value: 'FISICA'
            },
            {
              text: 'Intelectual',
              value: 'INTELECTUAL'
            },
            {
              text: 'Auditiva',
              value: 'AUDITIVA'
            },
            {
              text: 'Visual',
              value: 'VISUAL'
            },
            {
              text: 'Psicosocial',
              value: 'PSICOSOCIAL'
            },
            {
              text: 'Ningún miembro de la familia con discapacidad',
              value: 'NINGUNO'
            },
            {
              text: 'Prefiero no responder',
              value: 'PREFIERO_NO_RESPONDER'
            }
          ],
          conditions: []
        },
        {
          questionText: 'Durante los últimos cinco años, ¿algún miembro de mi familia falleció antes de cumplir 5 años?',
          codeName: 'memberDiedBefore5',
          answerType: 'select',
          topic: 'Datos de la familia',
          required: true,
          forFamilyMember: false,
          options: [
            {
              text: 'Si',
              value: 'SI'
            },
            {
              text: 'No',
              value: 'NO'
            }
          ],
          conditions: []
        },
        {
          questionText: '¿Mi familia tiene auto o camioneta?',
          codeName: 'familyCar',
          answerType: 'select',
          topic: 'Datos de la familia',
          required: true,
          forFamilyMember: false,
          options: [
            {
              text: 'Si',
              value: 'SI'
            },
            {
              text: 'No',
              value: 'NO'
            }
          ],
          conditions: []
        },
        {
          questionText: '¿Está actualmente matriculado?',
          codeName: 'schoolEnrolment',
          answerType: 'select',
          topic: 'Educación',
          required: true,
          forFamilyMember: true,
          options: [
            {
              text: 'Si',
              value: 'SI'
            },
            {
              text: 'No',
              value: 'NO'
            }
          ],
          conditions: [
            {
              codeName: 'birthdate',
              type: 'family',
              value: '18',
              operator: 'greater_than_eq'
            }
          ]
        },
        {
          questionText: 'Nivel actual / nivel maximo alcanzado',
          codeName: 'attainedLevel',
          answerType: 'select',
          topic: 'Educación',
          required: true,
          forFamilyMember: true,
          options: [
            {
              text: 'Inicial incompleta',
              value: 'INICIAL_INCOMPLETA'
            },
            {
              text: 'Inicial completa',
              value: 'INICIAL_COMPLETA'
            },
            {
              text: 'Primaria incompleta',
              value: 'PRIMARIA_INCOMPLETA'
            },
            {
              text: 'Primaria completa',
              value: 'PRIMARIA_COMPLETA'
            },
            {
              text: 'Secundaria incompleta',
              value: 'SECUNDARIA_INCOMPLETA'
            },
            {
              text: 'Secundaria completa',
              value: 'SECUNDARIA_COMPLETA'
            },
            {
              text: 'Superior incompleta',
              value: 'SUPERIOR_INCOMPLETA'
            },
            {
              text: 'Superior completa',
              value: 'SUPERIOR_COMPLETA'
            }
          ],
          conditions: [
            {
              codeName: 'birthdate',
              type: 'family',
              value: '20',
              operator: 'greater_than_eq'
            }
          ]
        },
        {
          questionText: 'Grado actual / grado máximo alcanzado',
          codeName: 'gradeLevel',
          answerType: 'select',
          topic: 'Educación',
          required: true,
          forFamilyMember: true,
          options: [
            {
              text: 'Sala de 4 años',
              value: 'SALA_DE_CUATRO_ANIOS'
            },
            {
              text: 'Sala de 5 años',
              value: 'SALA_DE_CINCO_ANIOS'
            },
            {
              text: 'Primer grado',
              value: 'PRIMER_GRADO'
            },
            {
              text: 'Segundo grado',
              value: 'SEGUNDO_GRADO'
            },
            {
              text: 'Tercer grado',
              value: 'TERCER_GRADO'
            },
            {
              text: 'Cuarto grado',
              value: 'CUARTO_GRADO'
            },
            {
              text: 'Quinto grado',
              value: 'QUINTO_GRADO'
            },
            {
              text: 'Sexto grado',
              value: 'SEXTO_GRADO'
            },
            {
              text: 'Séptimo grado',
              value: 'SEPTIMO_GRADO'
            },
            {
              text: 'Octavo grado',
              value: 'OCTAVO_GRADO'
            },
            {
              text: 'Noveno grado',
              value: 'NOVENO_GRADO'
            },
            {
              text: 'Primer año',
              value: 'PRIMER_ANIO'
            },
            {
              text: 'Segundo año',
              value: 'SEGUNDO_ANIO'
            },
            {
              text: 'Tercer año',
              value: 'TERCER_ANIO'
            },
            {
              text: 'Cuarto año',
              value: 'CUARTO_ANIO'
            },
            {
              text: 'Quinto año',
              value: 'QUINTO_ANIO'
            },
            {
              text: 'Sexto año',
              value: 'SEXTO_ANIO'
            },
            {
              text: 'Séptimo año',
              value: 'SEPTIMO_ANIO'
            },
            {
              text: 'Técnico',
              value: 'TECNICO'
            },
            {
              text: 'Universitario',
              value: 'UNIVERSITARIO'
            },
            {
              text: 'Posgrado',
              value: 'POSGRADO'
            },
            {
              text: 'Otro',
              value: 'OTRO'
            }
          ],
          conditions: [
            {
              codeName: 'birthdate',
              type: 'family',
              value: '25',
              operator: 'greater_than_eq'
            }
          ]
        },
        {
          questionText: 'Ingrese su actividad principal',
          codeName: 'activityMain',
          answerType: 'select',
          topic: 'Ingresos y Empleo',
          required: true,
          forFamilyMember: false,
          options: [
            {
              text: 'Ventas (Despensa, Copetín, Comestible)',
              value: 'VENTAS'
            },
            {
              text: 'Servicios (Peluquería, Limpieza, Manicura)',
              value: 'SERVICIOS'
            },
            {
              text: 'Manufactura (Arte)',
              value: 'MANUFACTURA'
            },
            {
              text: 'Enseñanza',
              value: 'ENSENANZA'
            },
            {
              text: 'Empleado/a de empresa privada',
              value: 'EMPLEADO_DE_EMPRESA_PRIVADA'
            },
            {
              text: 'Empleado/a de empresa pública',
              value: 'EMPLEADO_DE_EMPRESA_PUBLICA'
            },
            {
              text: 'Empleado/a de ONG (Organización no Gubernamental)',
              value: 'ONG'
            },
            {
              text: 'Otros',
              value: 'OTROS'
            },
            {
              text: 'No tiene',
              value: 'NO_TIENE'
            }
          ],
          conditions: []
        },
        {
          questionText: 'Mi ingreso mensual es:',
          codeName: 'householdMonthlyIncome',
          answerType: 'number',
          topic: 'Ingresos y Empleo',
          required: true,
          forFamilyMember: false,
          options: [],
          conditions: []
        },
        {
          questionText: 'Moneda en la que percibe sus ingresos',
          codeName: 'currency',
          answerType: 'select',
          topic: 'Ingresos y Empleo',
          required: true,
          forFamilyMember: false,
          options: [
            {
              text: 'Peso argentino',
              value: 'ARS'
            },
            {
              text: 'Guarani',
              value: 'PYG'
            },
            {
              text: 'Afghani',
              value: 'AFN'
            },
            {
              text: 'Ariary malgache',
              value: 'MGA'
            },
            {
              text: 'Armenian Dram',
              value: 'AMD'
            },
            {
              text: 'Aruban Florin',
              value: 'AWG'
            },
            {
              text: 'Azerbaiyán Manat',
              value: 'AZN'
            },
            {
              text: 'Baht',
              value: 'THB'
            },
            {
              text: 'Balboa',
              value: 'PAB'
            },
            {
              text: 'Birr etíope',
              value: 'ETB'
            },
            {
              text: 'Bolívar',
              value: 'VEF'
            },
            {
              text: 'Boliviano',
              value: 'BOB'
            },
            {
              text: 'Cabo Verde Escudo',
              value: 'CVE'
            },
            {
              text: 'CFA Franc BCEAO',
              value: 'XOF'
            },
            {
              text: 'CFA Franc BEAC',
              value: 'XAF'
            },
            {
              text: 'CFP Franc',
              value: 'XPF'
            },
            {
              text: 'Chelín de Kenia',
              value: 'KES'
            },
            {
              text: 'Chelín de Uganda',
              value: 'UGX'
            },
            {
              text: 'Chelín somalí',
              value: 'SOS'
            },
            {
              text: 'Chelín tanzano',
              value: 'TZS'
            },
            {
              text: 'Colon de Costa Rica',
              value: 'CRC'
            },
            {
              text: 'Cordoba Oro',
              value: 'NIO'
            },
            {
              text: 'Corona checa',
              value: 'CZK'
            },
            {
              text: 'Corona danesa',
              value: 'DKK'
            },
            {
              text: 'Corona de Islandia',
              value: 'ISK'
            },
            {
              text: 'Corona noruega',
              value: 'NOK'
            },
            {
              text: 'Corona sueca',
              value: 'SEK'
            },
            {
              text: 'Dalasi',
              value: 'GMD'
            },
            {
              text: 'Denar',
              value: 'MKD'
            },
            {
              text: 'Dinar argelino',
              value: 'DZD'
            },
            {
              text: 'Dinar bahreiní',
              value: 'BHD'
            },
            {
              text: 'Dinar iraquí',
              value: 'IQD'
            },
            {
              text: 'Dinar jordano',
              value: 'JOD'
            },
            {
              text: 'Dinar kuwaití',
              value: 'KWD'
            },
            {
              text: 'Dinar libio',
              value: 'LYD'
            },
            {
              text: 'Dinar serbio',
              value: 'RSD'
            },
            {
              text: 'Dinar tunecino',
              value: 'TND'
            },
            {
              text: 'Dirham marroquí',
              value: 'MAD'
            },
            {
              text: 'Dobra',
              value: 'STN'
            },
            {
              text: 'Dólar australiano',
              value: 'AUD'
            },
            {
              text: 'Dolar canadiense',
              value: 'CAD'
            },
            {
              text: 'Dólar de Barbados',
              value: 'BBD'
            },
            {
              text: 'Dólar de Belice',
              value: 'BZD'
            },
            {
              text: 'Dólar de Brunei',
              value: 'BND'
            },
            {
              text: 'Dólar de Fiji',
              value: 'FJD'
            },
            {
              text: 'Dólar de Guyana',
              value: 'GYD'
            },
            {
              text: 'Dolar de Hong Kong',
              value: 'HKD'
            },
            {
              text: 'Dólar de las Bahamas',
              value: 'BSD'
            },
            {
              text: 'Dólar de las Bermudas',
              value: 'BMD'
            },
            {
              text: 'Dólar de las Islas Caimán',
              value: 'KYD'
            },
            {
              text: 'Dólar de las Islas Salomón',
              value: 'SBD'
            },
            {
              text: 'Dólar de Namibia',
              value: 'NAD'
            },
            {
              text: 'Dolar de Nueva Zelanda',
              value: 'NZD'
            },
            {
              text: 'Dolar de Singapur',
              value: 'SGD'
            },
            {
              text: 'Dólar de Surinam',
              value: 'SRD'
            },
            {
              text: 'Dólar de Trinidad y Tobago',
              value: 'TTD'
            },
            {
              text: 'Dólar de Zimbabwe',
              value: 'ZWL'
            },
            {
              text: 'Dólar del Caribe Oriental',
              value: 'XCD'
            },
            {
              text: 'Dólar estadounidense',
              value: 'USD'
            },
            {
              text: 'Dólar Jamaiquino',
              value: 'JMD'
            },
            {
              text: 'Dólar liberiano',
              value: 'LRD'
            },
            {
              text: 'El Salvador Colon',
              value: 'SVC'
            },
            {
              text: 'Emiratos Árabes Unidos Dirham',
              value: 'AED'
            },
            {
              text: 'Euro',
              value: 'EUR'
            },
            {
              text: 'Florín de las Antillas Holandesas',
              value: 'ANG'
            },
            {
              text: 'Forint',
              value: 'HUF'
            },
            {
              text: 'Franco comorano',
              value: 'KMF'
            },
            {
              text: 'Franco congoleño',
              value: 'CDF'
            },
            {
              text: 'Franco de Burundi',
              value: 'BIF'
            },
            {
              text: 'Franco de Djibouti',
              value: 'DJF'
            },
            {
              text: 'Franco de Rwanda',
              value: 'RWF'
            },
            {
              text: 'Franco guineano',
              value: 'GNF'
            },
            {
              text: 'Franco suizo',
              value: 'CHF'
            },
            {
              text: 'Ghana Cedi',
              value: 'GHS'
            },
            {
              text: 'Gourde',
              value: 'HTG'
            },
            {
              text: 'Hryvnia',
              value: 'UAH'
            },
            {
              text: 'Kina',
              value: 'PGK'
            },
            {
              text: 'Kuna',
              value: 'HRK'
            },
            {
              text: 'Kwacha de Zambia',
              value: 'ZMW'
            },
            {
              text: 'Kwanza',
              value: 'AOA'
            },
            {
              text: 'Kyat',
              value: 'MMK'
            },
            {
              text: 'Lao Kip',
              value: 'LAK'
            },
            {
              text: 'Lari',
              value: 'GEL'
            },
            {
              text: 'Lek',
              value: 'ALL'
            },
            {
              text: 'Lempira',
              value: 'HNL'
            },
            {
              text: 'Leone',
              value: 'SLL'
            },
            {
              text: 'Leu moldavo',
              value: 'MDL'
            },
            {
              text: 'Leu rumano',
              value: 'RON'
            },
            {
              text: 'Lev búlgaro',
              value: 'BGN'
            },
            {
              text: 'Libra de Gibraltar',
              value: 'GIP'
            },
            {
              text: 'Libra de las Islas Malvinas',
              value: 'FKP'
            },
            {
              text: 'Libra egipcia',
              value: 'EGP'
            },
            {
              text: 'Libra esterlina',
              value: 'GBP'
            },
            {
              text: 'Libra libanesa',
              value: 'LBP'
            },
            {
              text: 'Libra siria',
              value: 'SYP'
            },
            {
              text: 'Libra sudanesa del sur',
              value: 'SSP'
            },
            {
              text: 'Libra sudanesa',
              value: 'SDG'
            },
            {
              text: 'Lilangeni',
              value: 'SZL'
            },
            {
              text: 'Lira turca',
              value: 'TRY'
            },
            {
              text: 'Loti',
              value: 'LSL'
            },
            {
              text: 'Malawi Kwacha',
              value: 'MWK'
            },
            {
              text: 'Marca Convertible',
              value: 'BAM'
            },
            {
              text: 'Mozambique Metical',
              value: 'MZN'
            },
            {
              text: 'Mvdol',
              value: 'BOV'
            },
            {
              text: 'Naira',
              value: 'NGN'
            },
            {
              text: 'Nakfa',
              value: 'ERN'
            },
            {
              text: 'Ngultrum',
              value: 'BTN'
            },
            {
              text: 'Nuevo dólar de Taiwán',
              value: 'TWD'
            },
            {
              text: 'Nuevo shekel israelí',
              value: 'ILS'
            },
            {
              text: 'Ouguiya',
              value: 'MRU'
            },
            {
              text: 'Pa\'anga',
              value: 'TOP'
            },
            {
              text: 'Pataca',
              value: 'MOP'
            },
            {
              text: 'Peso chileno',
              value: 'CLP'
            },
            {
              text: 'Peso colombiano',
              value: 'COP'
            },
            {
              text: 'Peso convertible',
              value: 'CUC'
            },
            {
              text: 'Peso cubano',
              value: 'CUP'
            },
            {
              text: 'Peso dominicano',
              value: 'DOP'
            },
            {
              text: 'Peso mexicano',
              value: 'MXN'
            },
            {
              text: 'Peso Uruguayo',
              value: 'UYU'
            },
            {
              text: 'Philippine Piso',
              value: 'PHP'
            },
            {
              text: 'Polla',
              value: 'VND'
            },
            {
              text: 'Pula',
              value: 'BWP'
            },
            {
              text: 'Quetzal',
              value: 'GTQ'
            },
            {
              text: 'Rand',
              value: 'ZAR'
            },
            {
              text: 'Real brasileño',
              value: 'BRL'
            },
            {
              text: 'Rial de Qatar',
              value: 'QAR'
            },
            {
              text: 'Rial iraní',
              value: 'IRR'
            },
            {
              text: 'Rial Omani',
              value: 'OMR'
            },
            {
              text: 'Rial yemení',
              value: 'YER'
            },
            {
              text: 'Riel',
              value: 'KHR'
            },
            {
              text: 'Ringgit malayo',
              value: 'MYR'
            },
            {
              text: 'Riyal saudí',
              value: 'SAR'
            },
            {
              text: 'Rublo bielorruso',
              value: 'BYN'
            },
            {
              text: 'Rublo ruso',
              value: 'RUB'
            },
            {
              text: 'Rufiyaa',
              value: 'MVR'
            },
            {
              text: 'Rupia de Mauricio',
              value: 'MUR'
            },
            {
              text: 'Rupia de Pakistán',
              value: 'PKR'
            },
            {
              text: 'Rupia de Seychelles',
              value: 'SCR'
            },
            {
              text: 'Rupia de Sri Lanka',
              value: 'LKR'
            },
            {
              text: 'Rupia india',
              value: 'INR'
            },
            {
              text: 'Rupia nepalesa',
              value: 'NPR'
            },
            {
              text: 'Rupiah',
              value: 'IDR'
            },
            {
              text: 'Santa Helena Libra',
              value: 'SHP'
            },
            {
              text: 'SDR (Special Drawing Right)',
              value: 'XDR'
            },
            {
              text: 'Sol',
              value: 'PEN'
            },
            {
              text: 'Som',
              value: 'KGS'
            },
            {
              text: 'Somoni',
              value: 'TJS'
            },
            {
              text: 'Sucre',
              value: 'XSU'
            },
            {
              text: 'Taka',
              value: 'BDT'
            },
            {
              text: 'Tala',
              value: 'WST'
            },
            {
              text: 'Tenge',
              value: 'KZT'
            },
            {
              text: 'Tugrik',
              value: 'MNT'
            },
            {
              text: 'Turkmenistán Nuevo Manat',
              value: 'TMT'
            },
            {
              text: 'Unidad de cuenta ADB',
              value: 'XUA'
            },
            {
              text: 'Unidad de Fomento',
              value: 'CLF'
            },
            {
              text: 'Unidad de Inversión Mexicana (UDI)',
              value: 'MXV'
            },
            {
              text: 'Unidad de Valor Real',
              value: 'COU'
            },
            {
              text: 'Uruguay Peso en Unidades Indexadas (URUIURUI)',
              value: 'UYI'
            },
            {
              text: 'Uzbekistán Sum',
              value: 'UZS'
            },
            {
              text: 'Vatu',
              value: 'VUV'
            },
            {
              text: 'WIR Euro',
              value: 'CHE'
            },
            {
              text: 'WIR Franc',
              value: 'CHW'
            },
            {
              text: 'Won norcoreano',
              value: 'KPW'
            },
            {
              text: 'Won',
              value: 'KRW'
            },
            {
              text: 'Yen',
              value: 'JPY'
            },
            {
              text: 'Yuan Renminbi',
              value: 'CNY'
            },
            {
              text: 'Zloty',
              value: 'PLN'
            }
          ],
          conditions: []
        },
        {
          questionText: 'El monto de ingresos que generan los otros miembros de mi familia mensualmente',
          codeName: 'otherMembersIncome',
          answerType: 'number',
          topic: 'Ingresos y Empleo',
          required: true,
          forFamilyMember: false,
          options: [],
          conditions: []
        },
        {
          questionText: 'Si recibe ingresos transferidos por Programas del Gobierno, ingrese el monto mensual',
          codeName: 'receiveStateIncome',
          answerType: 'number',
          topic: 'Ingresos y Empleo',
          required: false,
          forFamilyMember: false,
          options: [],
          conditions: []
        }
      ],
      surveyStoplightQuestions: [
        {
          questionText: 'Ingresos superiores a la línea de pobreza',
          codeName: 'income',
          dimension: 'Ingreso y Empleo',
          id: 428,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/YuMxrB9MB8dgdMbN6bWhlGrSxmXSRM69kOQOpVagLT8/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzEvMy5qcGc.jpg',
              value: 3,
              description: 'Los ingresos de mi familia superan el monto necesario para adquirir la CBT.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/ylcIgY9DqGUwbQ50CQaMlt5Fp116CmQX6MLSdGPgzZ0/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzEvMi5qcGc.jpg',
              value: 2,
              description: 'Los Ingresos de mi familia son apenas suficientes para adquirir la CBT.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/UFReseVINkWoOpkxWrETAS-RzIayPlyeOjlXD3fDKqg/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzEvMS5qcGc.jpg',
              value: 1,
              description: 'Los ingresos de mi familia alcanzan sólo para adquirir la CBA o se encuentran por debajo.'
            }
          ],
          required: false
        },
        {
          questionText: 'Ahorros familiares',
          codeName: 'familySavings',
          dimension: 'Ingreso y Empleo',
          id: 429,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/vMg35pOAZGnz7CNGZDmZ0L5NjuMRmMLJZHGtKaxPSic/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzIvMy5qcGc.jpg',
              value: 3,
              description: 'Uno o más miembros de mi familia tienen ahorros hace al menos seis meses y tiene una cuenta de ahorro a su nombre.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/AdihN1fi1pfTHHU36Sy0IjlefZc0BoIrP8aO32Dgudo/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzIvMi5qcGc.jpg',
              value: 2,
              description: 'Uno o más miembros de mi familia tienen ahorros de manera informal (mantienen el dinero en casa o en la propiedad, grupos informales de ahorro, etc.). O tienen una cuenta de ahorro hace menos de seis meses.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/8dwyE2NRZTHUM8NBQ62Ek04xwgeEZuln0QKjFz41_Ds/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzIvMS5qcGc.jpg',
              value: 1,
              description: 'Ningún miembro de mi familia tiene ahorros.'
            }
          ],
          required: false
        },
        {
          questionText: 'Acceso al crédito',
          codeName: 'accessToCredit',
          dimension: 'Ingreso y Empleo',
          id: 430,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/s27ZgI2nQBLrRk1T9w7RZyF2Re5iY6laBU7Qtw5CNnQ/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzMvMy5qcGc.jpg',
              value: 3,
              description: 'Al menos un miembro de mi familia ha accedido a créditos de instituciones legales, en los últimos doce meses. O los miembros de mi familia no requieren créditos porque pueden financiar todas sus necesidades a través de fuentes propias; sin embargo, pueden acceder a un crédito si lo necesitan.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/C0fC7zn3MTOeMJN8cu_VuzRTW4Gbb4s4X926GIDnPis/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzMvMi5qcGc.jpg',
              value: 2,
              description: 'Al menos un miembro de mi familia accedió a créditos en los últimos doce meses, pero solamente de instituciones no legales (macatero, familiares, patrón, etc.).'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/vpubLGIPbnf6ZiHGMhqYKDZFD7zl330bDjE1yw_QvDM/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzMvMS5qcGc.jpg',
              value: 1,
              description: 'Ninguno de los miembros de mi familia accedió a crédito en los últimos doce meses, a pesar de que quisieran hacerlo.\n O, al menos un miembro tiene crédito pero se encuentra con atraso mayor a tres meses.'
            }
          ],
          required: false
        },
        {
          questionText: 'Fuente de ingreso diversificada',
          codeName: 'diversifiedSourcesOfIncome',
          dimension: 'Ingreso y Empleo',
          id: 431,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/NtveSBWaj12IXaTxfCUDAPyF6-HfaZwGegm5hUZmnT0/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzQvMy5qcGc.jpg',
              value: 3,
              description: 'Si mi familia perdiera su principal fuente de ingresos, no afectaría su nivel de consumo durante el próximo mes. Se daría así porque tiene varias fuentes de ingresos que le ayudarían (otros miembros trabajan, tienen ahorros o activos que pueden vender rápidamente, etc.).'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/Vze-tivhsSoA1xphhdzFoXSH9H5Ccs8qXomrhQB_VAQ/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzQvMi5qcGc.jpg',
              value: 2,
              description: 'Si mi familia perdiera su principal fuente de ingresos, su consumo sufriría moderadamente durante el próximo mes. Se daría así porque tiene otra fuente de ingresos que le ayudaría (algún miembro trabaja, tienen ahorros o activos que pueden vender rápidamente, etc.).'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/HluRZI2aRDDKA4fi5TdXdt3yoHh6UXrNZ1kmU2lHKRI/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzQvMS5qcGc.jpg',
              value: 1,
              description: 'Si mi familia perdiera su principal fuente de ingresos, su consumo sufriría fuertemente durante el próximo mes. No tiene otras fuentes de ingresos, o ahorros o activos que pueden vender rápidamente.'
            }
          ],
          required: false
        },
        {
          questionText: 'Documentación: Cédula de Ciudadanía',
          codeName: 'documentation',
          dimension: 'Ingreso y Empleo',
          id: 432,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/4EGd8rhxSNZZT9NDzfCMeT-YqlBogokYrylpa5FCajI/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzUvMy5qcGc.jpg',
              value: 3,
              description: 'Todos los miembros de mi familia tienen DNI vigente.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/NXvq747wL528NcXGTNXeE4VOrlHNJSMf7eiTLvWK8ZE/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzUvMi5qcGc.jpg',
              value: 2,
              description: 'Todos los miembros de mi familia tienen DNI, pero uno o más tienen el documento vencido.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/_kx2nmq40oPZ8XvPEhfaTHj1oY6ZV_rS0BlH-a7pUyc/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzUvMS5qcGc.jpg',
              value: 1,
              description: 'Más de un miembro de mi familia no tiene DNI, es decir que no se encuentra inscripto en el Registro Civil.'
            }
          ],
          required: false
        },
        {
          questionText: 'Ambiente no contaminado',
          codeName: 'unpollutedEnvironment',
          dimension: 'Salud y Medioambiente',
          id: 433,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/IXLuJ1j55E6QmtGEpR9GoqbB2jgX0JWS3WUcAt-jQWE/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzYvMy5qcGc.jpg',
              value: 3,
              description: 'Mi familia vive en un ambiente no contaminado. No hay malos olores, ni humos inapropiados provenientes de industrias, producción pecuaria u otras fuentes; tampoco residuos de productos químicos mala eliminación o ausencia de tratamiento de basuras. Si hubo o hay contaminación se gestiona para resolverla.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/jJvQUyyBKTZxnXahaLJVqJiwRFMFMhufJnr6JL9IG4I/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzYvMi5qcGc.jpg',
              value: 2,
              description: 'Mi familia vive en un ambiente donde ocasionalmente hay contaminación. Hay malos olores y humo inapropiados provenientes de industrias, producción pecuaria u otras fuentes, residuos de productos químicos y mala eliminación o ausencia de tratamiento de basuras. Probablemente existe peligro para nuestra salud, pero no ha realizado gestiones para solucionar la contaminación.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/jVg8aBgL6qrFo7bkhsTdtQQXEngkv5Wp4Oghy5RieGU/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzYvMS5qcGc.jpg',
              value: 1,
              description: 'Mi familia vive en un ambiente donde siempre hay malos olores y humo inapropiados provenientes de industrias, producción pecuaria u otras fuentes, además de residuos de productos químicos, mala eliminación o ausencia de tratamiento de basuras. Existe peligro para su salud, pero no ha realizado gestiones para solucionar la contaminación.'
            }
          ],
          required: false
        },
        {
          questionText: 'Disposición de basura',
          codeName: 'garbageDisposal',
          dimension: 'Salud y Medioambiente',
          id: 434,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/OnX71ju63omHL2I60kFQmJn7DWurPrE-KlRjHhbDXjY/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzcvMy5qcGc.jpg',
              value: 3,
              description: 'Los miembros de mi familia depositan sus residuos en un basurero hasta su recolección o entierran los desechos orgánicos en un hoyo tapado distanciado al menos unos veinte metros de la vivienda, fuentes de agua y campo de cultivo y recicla los desechos inorgánicos.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/y2xEM8aW5PZADluCGYrKQ3SBTk9PrF5J8HjviuiOr0I/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzcvMi5qcGc.jpg',
              value: 2,
              description: 'Los miembros de mi familia entierran sus residuos en un hoyo tapado dentro de su terreno, pero está distanciado a menos de veinte metros de la vivienda, fuentes de agua y campo de cultivo.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/Qu5BhU2MH0fLujteOuAwcaZvMazyozbt0PQWhlMkM9M/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzcvMS5qcGc.jpg',
              value: 1,
              description: 'Los miembros de mi familia queman sus basuras o las tiran a cielo abierto en su terreno o cerca de la vivienda, fuentes de agua o campos de cultivo.'
            }
          ],
          required: false
        },
        {
          questionText: 'Acceso al agua potable',
          codeName: 'water',
          dimension: 'Salud y Medioambiente',
          id: 435,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/Vjbg-9k8P9rkQxkqQM1xX9JSHaEmB6QFWSQYaVA5phs/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzgvMy5qcGc.jpg',
              value: 3,
              description: 'Mi familia cuenta con agua potable y accede a ella a través de una canilla dentro del terreno de la casa.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/3lwIqZ185XBjMY8HZGGJrHtZW4P4K9KLZy4FfrVSS5Y/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzgvMi5qcGc.jpg',
              value: 2,
              description: 'Mi familia tiene acceso al agua potable fuera del terreno de la vivienda, a través de una canilla, un pozo o aljibe protegido, agua de manantial o pluvial protegido. La distancia para acceder a ella es menos de treinta minutos de caminata ida y vuelta de la casa.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/xf0AhjdMsCXnH32IBa9I2fnlo3ZvpZ_DqI3MeoPL4SU/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzgvMS5qcGc.jpg',
              value: 1,
              description: 'Mi familia bebe agua no potable o tiene que acarrearla desde un punto a más de 30 minutos de caminata ida y vuelta de la casa.'
            }
          ],
          required: false
        },
        {
          questionText: 'Acceso a servicios de salud',
          codeName: 'nearbyHealthPost',
          dimension: 'Salud y Medioambiente',
          id: 436,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/o76TlttBv2HhUSkzcihlzR3QOKJ1mSDS4CeeJ_55SJE/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzkvMy5qcGc.jpg',
              value: 3,
              description: 'En los últimos 3 meses, todas las veces cuando algún miembro de mi familia necesitó atención médica pudo obtenerla en un puesto de salud a menos de una hora de la casa, esperando menos de dos a ser atendido y sin ser discriminado.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/NE9nkg0w4kgk0uXMe2KAV1KzJm2z4EgjRpzZ8smqmM4/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzkvMi5qcGc.jpg',
              value: 2,
              description: 'En los últimos 3 meses, cuando algún miembro de mi familia necesitó atención médica de emergencia básica, pudo obtenerla. Pero no pudo obtener atención especializada, las consultas o medicinas le eran muy caras, el puesto de salud quedaba a más de una hora, esperó más de dos horas para ser atendido y/o fue discriminado.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/sdEdAi9YsWvgo6ysBDc2C7ok87a7o4O6VZ-9geywdbU/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzkvMS5qcGc.jpg',
              value: 1,
              description: 'En los últimos 3 meses, cuando mi familia necesitó atención médica por alguna enfermedad o accidente, no pudo obtenerla, debido a que no contaba con atención, la atención fue mala, las consultas o medicinas fueron demasiado caras, el tiempo de espera fue muy largo y/o fue discriminado.'
            }
          ],
          required: false
        },
        {
          questionText: 'Alimentación nutritiva',
          codeName: 'alimentation',
          dimension: 'Salud y Medioambiente',
          id: 437,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/PcOlqi6PJDEGjvxQoHUe6-V-gy_guK6oEkmsgbYKljM/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzEwLzMuanBn.jpg',
              value: 3,
              description: 'Todos los miembros de mi familia:\n a). consumieron una buena variedad de alimentos durante la última semana: 1. carnes (vaca, pollo, pescado, cordero, etc.), 2. Leche, yogur, quesos y/o derivados, 3. verduras variadas, 4. huevos, 5. frutas variadas, 6. Cereales, arroz, pasta, papa, maíz, etc.,\n y b). tuvieron, al menos, tres comidas en el día: desayuno, almuerzo y cena.\n Si se saltaron una comida o algún tipo de alimento fue por motivos voluntarios no asociados a la falta de dinero o alimentos (ej. religiosas o filosóficas).'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/21VTF7-rb4D4gKxZ-gqvrLRwNWkBNLVpUzIPIkB_Xx0/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzEwLzIuanBn.jpg',
              value: 2,
              description: 'En la última semana los miembros de mi familia no incluyeron en su dieta todos los componentes citados en el nivel verde.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/yj58bwFCoEIgUdrPKBqzxzCwfZJDv9yDdnJ0GYCehzo/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzEwLzEuanBn.jpg',
              value: 1,
              description: 'En la última semana, por lo menos una vez un miembro de mi familia se acostó con hambre o saltó una comida involuntariamente por falta de alimentos o dinero.'
            }
          ],
          required: false
        },
        {
          questionText: 'Higiene personal',
          codeName: 'personalHygiene',
          dimension: 'Salud y Medioambiente',
          id: 438,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/yNY_FRbkZjl4gFqUo5a-JLYnhoHbARszHJsfn5YFlgU/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzExLzMuanBn.jpg',
              value: 3,
              description: 'Todos los miembros de mi familia:\n a) se lavan las manos con jabón siempre que utilizan los servicios sanitarios,\n b) se lavan las manos con jabón antes de consumir y preparar sus alimentos,\n c) se cepillan los dientes diariamente,\n y d) se bañan diariamente.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/1Fk-2kBUwvpjlsgeOPFCkWe2i-9Uzq8_T6Zu8KhXkLE/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzExLzIuanBn.jpg',
              value: 2,
              description: 'Algunos miembros de mi familia no cumplen con alguno de los hábitos higiénicos descritos en el nivel verde.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/Cnd1WKrw8v0vpletY4PJM90PMTZTFefxyTOpWOBFM4o/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzExLzEuanBn.jpg',
              value: 1,
              description: 'Algunos miembros de mi familia no cumplen con más de uno de los hábitos higiénicos descritos en el nivel verde.\n O no estoy seguro de cuáles son los hábitos higiénicos de mi familia.'
            }
          ],
          required: false
        },
        {
          questionText: 'Salud sexual',
          codeName: 'sexualHealth',
          dimension: 'Salud y Medioambiente',
          id: 439,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/9Bpa4G0po9FHXs6sFY6wCmcnRitnejnZJVjjY--rtRQ/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzEyLzMuanBn.jpg',
              value: 3,
              description: 'Los miembros de mi familia:\n a) en edad reproductiva utilizan algún método de planificación familiar;\n b) las mujeres que requieren conocen y han efectuado un control ginecológico en los últimos doce meses, y\n c) las que están embarazadas asisten a todos los controles prenatales requeridos.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/zhSM4iSv2Le9Vhlu934YSrypZPgcy7u9pInho3nSQaE/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzEyLzIuanBn.jpg',
              value: 2,
              description: 'Los miembros de mi familia no cumplen con una de las características del nivel verde.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/hxkMUgq-ws9RH7ULQSSFsW-XNHA80ik15Gh6XsWOY9c/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzEyLzEuanBn.jpg',
              value: 1,
              description: 'Los miembros de mi familia no cumplen con más de una de las características del nivel verde.'
            }
          ],
          required: false
        },
        {
          questionText: 'Dientes sanos',
          codeName: 'dentalCare',
          dimension: 'Salud y Medioambiente',
          id: 440,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/ZNVlgdQP4ZVxyvqk6k7Y0huQu02yxzC-2pDxmwbBoqI/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzEzLzMuanBn.jpg',
              value: 3,
              description: 'Los miembros de mi familia no tienen problemas de dentadura, o si los tienen están siendo atendidos apropiadamente.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/NPqA2fPEEN9XG8jX5HhshV_lfoYECVJ6gYJytpKacKM/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzEzLzIuanBn.jpg',
              value: 2,
              description: 'Un integrante de mi familia tiene problemas de dentadura y no está siendo atendido apropiadamente.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/XygXJcwxVFMI4-VkRPNZePSSXBE8Pmp5mG5P_zVNN3g/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzEzLzEuanBn.jpg',
              value: 1,
              description: 'Más de un miembro de mi familia tiene problemas de dentadura y no está siendo atendido apropiadamente.'
            }
          ],
          required: false
        },
        {
          questionText: 'Vista sana',
          codeName: 'eyesight',
          dimension: 'Salud y Medioambiente',
          id: 441,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/XONqcijigJO4LZXOPmJ-timDS-Mmek8l_HtBzgtksS8/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzE0LzMuanBn.jpg',
              value: 3,
              description: 'Los miembros de mi familia no tienen problemas de vista o, si los tienen están siendo atendidos apropiadamente, por ejemplo, utilizan lentes.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/BxB4zieAjU9Su5sWWhPMTddp0Jd2SIsMVyRNavqdcFA/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzE0LzIuanBn.jpg',
              value: 2,
              description: 'Un integrante de mi familia tiene problemas de vista y no está siendo atendido apropiadamente.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/x4muBAzWVgf3sY4XiU0PcTXMi38A7RgFaGV4VZTzW0E/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzE0LzEuanBn.jpg',
              value: 1,
              description: 'Más de un miembro de mi familia tiene problemas de vista y no está siendo atendido apropiadamente.'
            }
          ],
          required: false
        },
        {
          questionText: 'Vacunas',
          codeName: 'vaccinations',
          dimension: 'Salud y Medioambiente',
          id: 442,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/OGH6DdKskr6hiUIVOfsqSrj28HOb9NER3r16ypFwf1k/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzE1LzMuanBn.jpg',
              value: 3,
              description: 'Todos los miembros de mi familia están inmunizados y están al día con todas las vacunas obligatorias, según el calendario de vacunación del Ministerio de Salud.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/cB3jD4CMhjMmZ1I21LU9_Vq2qIxOIoAXkYSKlOhQamY/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzE1LzIuanBn.jpg',
              value: 2,
              description: 'Un miembro de mi familia no está inmunizado o al día con todas las vacunas obligatorias, según el calendario de vacunación del Ministerio de Salud.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/g_6IjAhHHqdtqQKdmb6oD2wnMN6orB0_lCYZVMZu43M/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzE1LzEuanBn.jpg',
              value: 1,
              description: 'Más de un miembro de mi familia no está inmunizado o al día con todas las vacunas obligatorias según el calendario de vacunación del Ministerio de Salud Pública y Bienestar Social.'
            }
          ],
          required: false
        },
        {
          questionText: 'Consumos problemáticos',
          codeName: 'drugs',
          dimension: 'Salud y Medioambiente',
          id: 443,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/R8KUK287Ay7VHAXWBV2fxskvbLxm2i7rwf9oojuRPKg/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzE2LzMuanBn.jpg',
              value: 3,
              description: 'Ningún miembro de mi familia consume tabaco, toma alcohol en exceso (al punto de llegar a alterar la conciencia y/o el comportamiento), consume drogas o manifiesta adicción al juego.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/O5cMwkWpvobnMwgNsG-Pp1H4PXuIYwPAKkvhOKhZ9ME/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzE2LzIuanBn.jpg',
              value: 2,
              description: 'Al menos un miembro de mi familia tiene una de las adicciones mencionadas anteriormente o consume dichas sustancias de manera problemática.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/K7jpYOPKTFUIZtvAOfnyYIyRba5B0GCgpWMEbQQhklk/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzE2LzEuanBn.jpg',
              value: 1,
              description: 'Más de un miembro de mi familia consume de manera problemática o un miembro de la familia tiene más de una de las adicciones mencionadas anteriormente.'
            }
          ],
          required: false
        },
        {
          questionText: 'Deporte y actividad física',
          codeName: 'sports',
          dimension: 'Salud y Medioambiente',
          id: 444,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/7HsGe3p2lewd3S6U1B82i2GnCxrjmaKk_NkbarF55w8/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzE3LzIuanBn.jpg',
              value: 3,
              description: 'Todos los miembros de mi familia realizan actividad física de manera constante (al menos 2 veces por semana).'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/t6kBW3K6YK9Xn4AUlMTMImaP35C2fVQO6YlsIl-XqiU/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzE3LzMuanBn.jpg',
              value: 2,
              description: 'Al menos un miembro de mi familia no realiza actividad física de manera constante.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/uLmklb-vQcfB0QiGuichCxJjl1UAkQfOfvAjKEz9TWQ/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzE3LzEuanBn.jpg',
              value: 1,
              description: 'Ningún miembro de mi familia realiza actividad física de manera constante.'
            }
          ],
          required: false
        },
        {
          questionText: 'Seguros',
          codeName: 'insurance',
          dimension: 'Salud y Medioambiente',
          id: 445,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/elG0wc0TwKCD16Iay32M2HP_0QssUwh4TEW5EyYXeFE/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzE4LzMuanBn.jpg',
              value: 3,
              description: 'Todos los miembros de mi familia tienen un seguro médico y al menos un miembro tiene otro tipo de seguro que puede ser: del hogar, contra robo del vehículo, contra incendio, de cosecha, de ganado, de empresa, de vida, de sepelio, etc.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/pFnkM5lt4iLxfKJ6Xa_Ri7I3F4JvLgOn2tERW09eNCw/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzE4LzIuanBn.jpg',
              value: 2,
              description: 'Todos los miembros de mi familia tienen seguro médico pero ningún miembro tiene otro tipo de seguro.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/khFgzbMNJXpCDXC385xl73PkNtVkJaglLQJjUjmY0b4/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzE4LzEuanBn.jpg',
              value: 1,
              description: 'Al menos un miembro de mi familia no cuenta con seguro médico.'
            }
          ],
          required: false
        },
        {
          questionText: 'Vivienda segura',
          codeName: 'safeHouse',
          dimension: 'Vivienda e Infraestructura',
          id: 446,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/2Ns_nQENRVAL5WCHNMSq3NUmOyFwsbL2dJW39C86wfY/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzE5LzMuanBn.jpg',
              value: 3,
              description: 'Mi familia tiene una vivienda con:\n a) techo de tejas, chapa de zinc u hormigón armado,\n b) paredes sólidas de madera, cemento o material cocido (ladrillo, baldosa, cemento, cerámica o similar),\n c) piso de madera o material cocido,\n d) puertas y ventanas externas de madera maciza o metal y todas se cierran de manera segura utilizando candados, cerraduras, trancas, pasadores resistentes u otros similares,\n e) la vivienda está preparada para distintas condiciones climáticas.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/BJXhqKliEKUCd_M-hWfeUm29lU_TPycpPaYgizOAS6o/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzE5LzIuanBn.jpg',
              value: 2,
              description: 'Mi familia tiene una vivienda que no cuenta con uno de los componentes del nivel verde.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/8y6gJDa1-ML-o4hzs5sJNO82hdEUSwCu47J57zSrsRQ/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzE5LzEuanBn.jpg',
              value: 1,
              description: 'Mi familia tiene una vivienda que no cuenta con dos o más de los componentes del nivel verde.'
            }
          ],
          required: false
        },
        {
          questionText: 'Confort del hogar',
          codeName: 'comfortOfTheHome',
          dimension: 'Vivienda e Infraestructura',
          id: 447,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/L0z8hjMKDfu6_OQRCSxR2qpNYpZKSpSqoRWAug7fIME/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzIwLzMuanBn.jpg',
              value: 3,
              description: 'Mi familia dispone de:\n a) sillas, mesas y cubiertos suficientes para todos los miembros,\n b) camas suficientes para todos (una por persona o por pareja),\n y c) ventiladores o acondicionadores de aire y calefactores.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/5OCYaEWLRboSOgwr7eRc5kVt6OugaXR1fNvQcb_3dH0/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzIwLzIuanBn.jpg',
              value: 2,
              description: 'Mi familia carece de uno de los elementos descriptos en el nivel verde, no los tiene o no son suficientes.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/GyTczKgCLGmPuJ2D-UBPerc1FBTKICACIwlCSHWTcTk/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzIwLzEuanBn.jpg',
              value: 1,
              description: 'Mi familia carece de dos o más los elementos descriptos en el nivel verde, no los tiene o no son suficientes.'
            }
          ],
          required: false
        },
        {
          questionText: 'Dormitorios separados',
          codeName: 'separateBedrooms',
          dimension: 'Vivienda e Infraestructura',
          id: 448,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/1Cohg0dwsOhWnyfUyuqxgcQbLqNFtSVkHBGdGM2J2yA/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzIxLzMuanBn.jpg',
              value: 3,
              description: 'Cada dormitorio es utilizado en promedio por dos o menos miembros de mi familia. Si algunos de los grupos (niños, adolescentes y adultos) lo comparten es por su voluntad.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/wtZ_Hwtx4MS1AgMkgQSNaX_Km7E_L4v7AngU4gniC8Y/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzIxLzIuanBn.jpg',
              value: 2,
              description: 'Cada dormitorio es utilizado en promedio por dos o menos miembros de mi familia. Algunos de los grupos (niños, adolescentes y adultos) lo comparten involuntariamente.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/BQTFYt16hmVlpF25W6vGUGyr3lvWCl9prxygDsdhiZ0/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzIxLzEuanBn.jpg',
              value: 1,
              description: 'Cada dormitorio es utilizado en promedio por tres o más miembros de mi familia.'
            }
          ],
          required: false
        },
        {
          questionText: 'Cocina elevada y ventilada',
          codeName: 'properKitchen',
          dimension: 'Vivienda e Infraestructura',
          id: 449,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/V1JeZhX97b1A4H_FAxLfwpqeYTiueqmiuECzt4nvG00/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzIyLzMuanBn.jpg',
              value: 3,
              description: 'Mi familia cocina en un espacio cubierto, protegido y ventilado. Cuenta con una cocina elevada y no utiliza estiércol, carbón o leña.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/MdZ30dXn8nLwLqbDmrRqSLxec6r-kM2n8qn4Nc7vNHc/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzIyLzIuanBn.jpg',
              value: 2,
              description: 'Mi familia cocina en un espacio cubierto, protegido pero no ventilado o cocina al aire libre o en fogón (no cuenta con cocina elevada). En ningún caso utiliza estiércol, carbón o leña.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/BuFXPq73dN9jqF9asrWDh_Q_3pXG15JzBw39FJmeZpw/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzIyLzEuanBn.jpg',
              value: 1,
              description: 'Mi familia cocina utilizando, principalmente, estiércol, carbón o leña.'
            }
          ],
          required: false
        },
        {
          questionText: 'Baño',
          codeName: 'safeBathroom',
          dimension: 'Vivienda e Infraestructura',
          id: 450,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/4nGcaupVWicoBdoO87a60x8GanR9YqSmJoFTuw5Qcyg/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzIzLzMuanBn.jpg',
              value: 3,
              description: 'Mi familia tiene un baño moderno, lo que significa que cuenta con:\n a)inodoro completo (WC);\n b)ducha de agua fría y caliente\n c) cisterna;\n d) asegura la privacidad; es un espacio cerrado y cubierto;\n e) cuenta con un buen sistema de evacuación;\n f) no se comparte con otra familia, y\n g) se mantiene limpio.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/g4UnVc1qygBuS4PHZNXfiMIF1Xge9GkVwgOj8iHfi0c/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzIzLzIuanBn.jpg',
              value: 2,
              description: 'Aunque el baño de mi familia no reúne todos los requisitos descriptos para el nivel verde, cuenta con algún tipo de inodoro con agua, una letrina con losa y buena ventilación, o inodoro orgánico. No se comparte con otra familia.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/3x3SzCfP3yas9vn0d4Ul_jYed3SwMrmnnyDIm-Rn9AE/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzIzLzEuanBn.jpg',
              value: 1,
              description: 'Mi familia comparte su baño o letrina con otra familia o no reúne los requisitos para el nivel amarillo.'
            }
          ],
          required: false
        },
        {
          questionText: 'Heladera y otros activos',
          codeName: 'refrigerator',
          dimension: 'Vivienda e Infraestructura',
          id: 451,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/FUAwC2Z3CuGS5NkEOj1jgcwiYtzZclSbWGzNLfWMagM/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzI0LzMuanBn.jpg',
              value: 3,
              description: 'Mi familia tiene heladera y dos o más de los siguientes activos: radio, TV, teléfono, motocicleta, lavarropas.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/Vv4B9gPOevEhE_blqjVtkgOgjFwE1ZpuaQSOCn42Fag/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzI0LzIuanBn.jpg',
              value: 2,
              description: 'Mi familia tiene dos de estos activos: radio, TV, teléfono, motocicleta, lavarropas, heladera.\n O si tiene más de dos, no tiene heladera.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/Na__UtbMTqsLcNf1xD4eAynWzzNhdX3Qn0Q98ipcIIc/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzI0LzEuanBn.jpg',
              value: 1,
              description: 'Mi familia tiene uno o ninguno de estos activos: radio, TV, teléfono, motocicleta, lavarropas, heladera.'
            }
          ],
          required: false
        },
        {
          questionText: 'Teléfono o celular',
          codeName: 'phone',
          dimension: 'Vivienda e Infraestructura',
          id: 452,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/k0XzY80I2pAf-e0TTwNTSFGtsIuWjADAmFlbH_IQbvU/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzI1LzMuanBn.jpg',
              value: 3,
              description: 'Mi familia cuenta con servicio de telefonía línea baja o celular disponible de manera constante.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/Q16GTwM2jp7L81gZiBiiNHtywcORWoZ68Qz8_uC1t5w/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzI1LzIuanBn.jpg',
              value: 2,
              description: 'Mi familia cuenta con servicio de telefonía línea baja o celular, pero puede utilizarlo solamente parte del tiempo.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/XiJ14SEmUV8fTYUAmvDoLSNTqGPZEkHAIsN9KQ4KASI/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzI1LzEuanBn.jpg',
              value: 1,
              description: 'Mi familia no cuenta con servicio de telefonía (ni celular, ni línea baja).'
            }
          ],
          required: false
        },
        {
          questionText: 'Vestimenta suficiente y apropiada',
          codeName: 'clothingAndFootwear',
          dimension: 'Vivienda e Infraestructura',
          id: 453,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/2jNG-RD7zLRz6AW3x3-a1n08PIbGSaaz8gGkpKu1b_g/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzI2LzMuanBn.jpg',
              value: 3,
              description: 'Todos los miembros de mi familia cuentan con ropas y calzados apropiados para la estación, en cantidad suficiente, para cambiarse diariamente.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/MbNqyN0Drd3-6esT68EsuhfsWa7TFkm0V86ZdYxjTK8/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzI2LzIuanBn.jpg',
              value: 2,
              description: 'Todos los miembros de mi familia tienen ropas y calzados apropiados para la estación, pero no para cambiarse diariamente.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/OkIsZ_q6ETmUZ9oY0gilEvM4xHe6kDKRWACa8dbZDDs/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzI2LzEuanBn.jpg',
              value: 1,
              description: 'Por lo menos un miembro de mi familia carece de ropa y calzados apropiados para la estación ni para cambiarse diariamente.'
            }
          ],
          required: false
        },
        {
          questionText: 'Seguridad de las personas',
          codeName: 'safety',
          dimension: 'Vivienda e Infraestructura',
          id: 454,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/LlIAO-MTEKKhsZv3FJyTsGfpSCL-g7Oe-b9D_esip1s/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzI3LzMuanBn.jpg',
              value: 3,
              description: 'Ningún miembro de mi familia ha sufrido actos de violencia contra su persona en los últimos doce meses.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/XSvwjA9G9LCBp7rgIdU51tnH4IoN2Pp6Vnl-YOnUAbY/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzI3LzIuanBn.jpg',
              value: 2,
              description: 'Al menos un miembro de mi familia sufrió́ un acto de violencia contra su persona en los últimos doce meses, pero igualmente pudo seguir con sus actividades o asistir al trabajo.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/5owZ8ScyCBDrCMDKuChp-6VIy18IcIwVth4ixTQYz1I/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzI3LzEuanBn.jpg',
              value: 1,
              description: 'Al menos un miembro de mi familia sufrió un acto de violencia contra su persona en los últimos doce meses y como resultado no pudo trabajar por un día entero o más, o fue causa de muerte.'
            }
          ],
          required: false
        },
        {
          questionText: 'Seguridad de los bienes',
          codeName: 'securityOfProperty',
          dimension: 'Vivienda e Infraestructura',
          id: 455,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/xUFGCZWkKiUtdInjj-rMVttWd9hta03bJL2IYPlH7_A/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzI4LzMuanBn.jpg',
              value: 3,
              description: 'Mi familia no ha sufrido actos de violencia y/o robo contra sus bienes en los últimos doce meses.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/YyrxEIrEVhAefKtuWiIYG3hBt1n3ZYaGNhjbQNFfV00/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzI4LzIuanBn.jpg',
              value: 2,
              description: 'Mi familia sufrió un acto de violencia y/o robo contra sus bienes en los últimos doce meses, y el valor de la propiedad dañada o robada es menor al equivalente de una semana de los ingresos de la familia.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/JX0CtyBOmtoL-dvggSiI7QynF4V-j92FEnam476Q6MU/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzI4LzEuanBn.jpg',
              value: 1,
              description: 'Mi familia sufrió más de un acto de violencia y/o robo contra sus bienes en los últimos doce meses, o sufrió un solo acto donde el valor del bien dañado o robado es equivalente o mayor a una semana de ingresos de la familia.'
            }
          ],
          required: false
        },
        {
          questionText: 'Electricidad',
          codeName: 'electricityAccess',
          dimension: 'Vivienda e Infraestructura',
          id: 456,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/ifFYl-6gVdDRPKtdntOOtxfccz5an3wAFi-WpV5bBJA/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzI5LzMuanBn.jpg',
              value: 3,
              description: 'Mi familia tiene acceso permanente y no clandestino a la electricidad.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/s84FWdZpspPwYhPaQzxWCUN2EFTZ-WL-G29fonP1M0k/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzI5LzIuanBn.jpg',
              value: 2,
              description: 'Mi familia tiene acceso a la electricidad, pero el acceso es clandestino y/o insuficiente (pasa cuatro horas o más del día sin electricidad en temporada alta).'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/tqsuG7enHRvv_jqlGoofXFbosH3on8ZBG2P7MpmLeAk/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzI5LzEuanBn.jpg',
              value: 1,
              description: 'Mi familia no tiene acceso a fuentes de energía para iluminar la casa/alrededores, cocinar de manera sustentable y al agua caliente.'
            }
          ],
          required: false
        },
        {
          questionText: 'Medios de transporte regular',
          codeName: 'regularMeansOfTransportation',
          dimension: 'Vivienda e Infraestructura',
          id: 457,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/aewJVPmb2-uW8LkucuEqu3prRqXH-nt1JeWzHZzY-uU/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzMwLzMuanBn.jpg',
              value: 3,
              description: 'Mi familia tiene acceso a transporte regular y confiable, ya sea propio o público a menos de diez minutos de la casa y que pasa por lo menos cada una hora.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/rEWxFMo_87-4SFUeWI3iJRykKW8O8EwsP7ZP0X_hr74/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzMwLzIuanBn.jpg',
              value: 2,
              description: 'Mi familia tiene acceso a transporte que no es regular y/o confiable, ya sea propio o público a menos de treinta minutos de la casa y que pasa por lo menos cada dos horas.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/RbSwY9jx9hmEwfX12PfsvK7RzVx24ZNV0L8PmBO1XQU/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzMwLzEuanBn.jpg',
              value: 1,
              description: 'Mi familia no tiene acceso a transporte propio y el público se encuentra a más de 30 minutos de la casa o pasa con frecuencia mayor a dos horas.'
            }
          ],
          required: false
        },
        {
          questionText: 'Camino de acceso de todo tiempo',
          codeName: 'road',
          dimension: 'Vivienda e Infraestructura',
          id: 458,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/Uo9uB0W1Fo50iAEYCl4X8zQvU0RVTbxVn_5g1hq_U7c/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzMxLzMuanBn.jpg',
              value: 3,
              description: 'El camino que utiliza mi familia para trasladarse al centro urbano más cercano es asfaltado, empedrado, adoquinado, enripiado, y es accesible todo el tiempo, incluso en periodo de lluvias fuertes o continuas.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/2g5hHU6o6Y1r4tIZSDL3RE72_oeEBKWBiNWbgt-6UzA/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzMxLzIuanBn.jpg',
              value: 2,
              description: 'El camino que utiliza mi familia para trasladarse al centro urbano más cercano es de tierra o es asfaltado, empedrado, adoquinado, enripiado, en mal estado y difícil de transitar en periodo de lluvias fuertes o continuas.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/uSKVbngcbqKttXh0wBmvm6Ab53YKxYi1v4gBx65LGMU/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzMxLzEuanBn.jpg',
              value: 1,
              description: 'El camino que utiliza mi familia para trasladarse al centro urbano más cercano es de tierra y ante la menor inclemencia del tiempo, se vuelve difícil de transitar.'
            }
          ],
          required: false
        },
        {
          questionText: 'Hijos escolarizados hasta el 3º año de la media',
          codeName: 'middleEducation',
          dimension: 'Educación y Cultura',
          id: 459,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/09ZrqBgBI4TcWWfpBNs1YVTcej9NKN7Yt6iDqbRyJ4k/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzMyLzMuanBn.jpg',
              value: 3,
              description: 'Todos los miembros de mi familia en edad escolar van a la escuela o han terminado el secundario.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/VqUswIx3I83DBxsZviqKgANxYF9s3-S-9Nrrbf3dbXo/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzMyLzIuanBn.jpg',
              value: 2,
              description: 'Entre los miembros de mi familia hay al menos un menor de 18 años que no va a la escuela o no finalizó la fase de educación secundaria.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/9jm8PYuiUtRVkEq25GaC7zaTWLVuJDR9JJ_HFBTaxjU/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzMyLzEuanBn.jpg',
              value: 1,
              description: 'Ningún miembro de mi familia menor de 18 años va a la escuela.'
            }
          ],
          required: false
        },
        {
          questionText: 'Sabe leer, escribir y comprender',
          codeName: 'readAndWrite',
          dimension: 'Educación y Cultura',
          id: 460,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/NXphkmLoIciCH03aWQrUtvWJof3n1GWqlvoDVjCX05Y/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzMzLzMuanBn.jpg',
              value: 3,
              description: 'Todos los miembros de mi familia (quince años y más) pueden leer, escribir y sienten que lo hacen con facilitad.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/f1o1syYBldIbaYufvqeQpj83XDtO-3MZD6o8L4SOynI/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzMzLzIuanBn.jpg',
              value: 2,
              description: 'Todos los miembros de mi familia (quince años y más) saben leer y escribir, pero al menos uno siente que le cuesta leer y/o escribir sus ideas.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/36Lz3uIbCVfQy1iKFDZBbBfGcId1IpjEap9DBzx5PrA/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzMzLzEuanBn.jpg',
              value: 1,
              description: 'Al menos un miembro de mi familia (quince años y más) no puede leer y/o escribir.'
            }
          ],
          required: false
        },
        {
          questionText: 'Útiles escolares y libros',
          codeName: 'schoolSuppliesAndBooks',
          dimension: 'Educación y Cultura',
          id: 461,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/H_NxJ4K-SUuw7NugWSA6L9YQfAmW_Q5JI4LLuKLmxqw/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzM0LzMuanBn.jpg',
              value: 3,
              description: 'Los miembros de mi familia, que están escolarizados, cuentan con todos los útiles escolares y libros recomendados por el profesor, además de tener acceso a una computadora.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/coxUvQ5vHZblEu_V6dgEw74FCA3JTKyyO6GlYXZONSU/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzM0LzIuanBn.jpg',
              value: 2,
              description: 'Los miembros de mi familia, que están escolarizados, cuentan con la mayoría de los útiles escolares recomendados el profesor y tienen acceso no regular a una computadora'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/8yS7xEDU09vx3eJgp5kIwSRJ9IdYQqnR5g9-qtg37pQ/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzM0LzEuanBn.jpg',
              value: 1,
              description: 'Los miembros de la familia, que están escolarizados, no cuentan con la mayoría de los útiles escolares recomendados por el profesor ni con acceso a una computadora.'
            }
          ],
          required: false
        },
        {
          questionText: 'Capacidad de planificar y presupuestar',
          codeName: 'capacityToPlanAndBudget',
          dimension: 'Educación y Cultura',
          id: 462,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/gex3hhnhimU5iK2TzN4pcgKiOufVVaJwPCqiIivGt7I/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzM1LzMuanBn.jpg',
              value: 3,
              description: 'Mi familia planifica su futuro económico y elabora un presupuesto mensual escrito, que utiliza y rige la economía permanentemente.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/lvvKZBZ3lOeqA4OFjuGo8NIrRMaRA4TanNAT_2QxJ_w/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzM1LzIuanBn.jpg',
              value: 2,
              description: 'Mi familia planifica su futuro económico y elabora un presupuesto mensual escrito, pero no lo utiliza y no rige la economía permanentemente.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/9UV-Eprbl3n_1h1kYqyoMN79_tPuqfoS7bL3PbYRaDU/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzM1LzEuanBn.jpg',
              value: 1,
              description: 'Mi familia no planifica su futuro económico y no tiene un presupuesto escrito.'
            }
          ],
          required: false
        },
        {
          questionText: 'Capacidad para generar ingresos',
          codeName: 'knowledgeAndSkillsToGenerateIncome',
          dimension: 'Educación y Cultura',
          id: 463,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/Lwsy4Fv_EXFyPQzriUlvThgXVPSDzDaPAyZHdSWyiSA/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzM2LzMuanBn.jpg',
              value: 3,
              description: 'Al menos un miembro de mi familia:\n a) tiene formación profesional u otras habilidades desarrolladas y adquiridas para generar ingresos, y estas características le permiten encontrar trabajo con facilidad.\n O, b) cuenta con un emprendimiento (negocio o actividad propia) que le genera ingresos suficientes para cubrir los gastos básicos del hogar.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/tXcpx1r9Ip2CLGSkGRt1Pl_Pz6IEkfROseTB6PK6wjk/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzM2LzIuanBn.jpg',
              value: 2,
              description: 'Al menos un miembro de mi familia:\n a) tiene formación profesional u otras habilidades desarrolladas y adquiridas para generar ingresos, sin embargo, hay situaciones en las que no sabe/sabría cómo afrontar una situación negativa para generar ingresos.\n O b) cuenta con un emprendimiento (negocio o actividad propia) que le genera ingresos, pero estos son insuficientes para cubrir los gastos básicos del hogar.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/HwOXxFkq3SetoqY71edKfnXFww7CqvLL65eviSyJQmo/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzM2LzEuanBn.jpg',
              value: 1,
              description: 'Ningún miembro de mi familia:\n a) tiene formación profesional u otras habilidades desarrolladas y adquiridas para generar ingresos,\n ni b) cuenta con un emprendimiento (negocio o actividad propia) que le permite generar ingresos para cubrir los gastos básicos del hogar.'
            }
          ],
          required: false
        },
        {
          questionText: 'Acceso a la información (TV e internet)',
          codeName: 'informationAccess',
          dimension: 'Educación y Cultura',
          id: 464,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/b7nr_EfJaGO9jHXuZr5L_FVBjyUe1C7_yigzRG4jzRU/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzM3LzMuanBn.jpg',
              value: 3,
              description: 'Mi familia cuenta con un televisor o acceso a internet de manera constante.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/g7kiwCmnt-V2vvTATh0lQRgpjRatAmGxy-8KYPFvbSk/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzM3LzIuanBn.jpg',
              value: 2,
              description: 'Mi familia cuenta solo con una radio.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/F1AXx89MGxKN3TVC4TfSgYY9Lofv6iH9SY1WMoLVZFk/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzM3LzEuanBn.jpg',
              value: 1,
              description: 'Mi familia no cuenta con radio, televisor o internet.'
            }
          ],
          required: false
        },
        {
          questionText: 'Acceso al entretenimiento',
          codeName: 'entertainmentAndRecreation',
          dimension: 'Educación y Cultura',
          id: 465,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/abq11vWECi8fGkhzAnHA2WCmVAoQ3kSj3N_FuHd8580/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzM4LzMuanBn.jpg',
              value: 3,
              description: 'Todos los miembros de mi familia tienen actividades de entretenimiento semanales.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/2sk660mHZDy-DpOuo1Lb_hFH_tYx5tK1Z0Td1J4l4Sk/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzM4LzIuanBn.jpg',
              value: 2,
              description: 'Algunos miembros de mi familia tienen actividades de entretenimiento semanales.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/XreVG9oLkyXIMtzSnO-wRBqzbzkrNsk0-ZKXU02H_4Y/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzM4LzEuanBn.jpg',
              value: 1,
              description: 'La mayoría de los miembros de mi familia no tienen actividades de entretenimiento semanales.'
            }
          ],
          required: false
        },
        {
          questionText: 'Respeto a la diversidad',
          codeName: 'respectForDiversity',
          dimension: 'Educación y Cultura',
          id: 466,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/uqpyNYusl_MIq9Fo_tkj0b_KbYiV_osNRfBIiu3fA8U/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzM5LzMuanBn.jpg',
              value: 3,
              description: 'Pienso que todas las personas, independientemente de su religión, etnia, idioma, capacidades, género, orientación sexual, o similar, deben ser tratadas con respeto.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/_QvrAkOx8TOPJXf_7jZF5IrnR3B_dRMAE8fIXpifHXg/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzM5LzIuanBn.jpg',
              value: 2,
              description: 'Pienso que las personas deben ser tratadas con respeto, aunque hay algunas religiones, etnias, género, orientaciones sexuales o características físicas a las que no las trato con respeto.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/WIBbfIgkB_sbF_Ti-x33Xa7YqQuIcoqHIZIPYD8-MGM/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzM5LzEuanBn.jpg',
              value: 1,
              description: 'No trato a las personas con respeto.'
            }
          ],
          required: false
        },
        {
          questionText: 'Conciencia de los derechos humanos',
          codeName: 'awarenessOfHumanRights',
          dimension: 'Educación y Cultura',
          id: 467,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/ueHfS4DJk9eHJ49d3WKB-O9iJ4f8I76HoxrJd6Zs5CI/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzQwLzMuanBn.jpg',
              value: 3,
              description: 'Pienso que cada persona debe tener los mismos derechos básicos, y que todos tenemos la misma responsabilidad de respetar siempre los derechos humanos. Los derechos básicos son los mismos independientemente del sexo, edad, origen étnico o racial, nacionalidad, clase social, orientación sexual, religión, discapacidad, etc.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/R9LM6iQhemaY18tChS2bYJ4L7TkFiZyJOd4xNbO6wzA/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzQwLzIuanBn.jpg',
              value: 2,
              description: 'Pienso que cada persona debe tener los mismos derechos básicos, pero pienso que no es mi responsabilidad respetar siempre estos derechos.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/1aW98F0ZczvU4Sd-r8Bi3qb9C_LrqdJDoPbhRRbtd90/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzQwLzEuanBn.jpg',
              value: 1,
              description: 'Pienso que las personas no deben tener los mismos derechos básicos y que no es mi responsabilidad respetarles. Esto depende de su sexo, edad, origen étnico o racial, nacionalidad, clase social, orientación sexual, religión, discapacidad, etc.'
            }
          ],
          required: false
        },
        {
          questionText: 'Trabajo infantil',
          codeName: 'childLabor',
          dimension: 'Educación y Cultura',
          id: 468,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/7v99cGxG3JZk8jM3Iwe66dC6x3TDoXgDZuk3eNgSDpw/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzQxLzMuanBn.jpg',
              value: 3,
              description: 'Entre los miembros de mi familia ningún niño entre diez y catorce años está trabajando.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/FX7fob_lWcY7NvGdF9qKMs3_rscav9dZ5KWazXri-_w/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzQxLzIuanBn.jpg',
              value: 2,
              description: 'Entre los miembros de mi familia hay un niño entre diez y catorce años que está trabajando, pero asiste a la escuela regularmente.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/5gbyxsXKUev5cO9LtyWmV0rMc0aEXwxUqNgzueFj2XI/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzQxLzEuanBn.jpg',
              value: 1,
              description: 'Entre los miembros de mi familia hay al menos un niño entre diez y catorce años que está trabajando y por eso no asiste a la escuela regularmente.'
            }
          ],
          required: false
        },
        {
          questionText: 'Forma  parte de un grupo',
          codeName: 'socialCapital',
          dimension: 'Organización y Participación',
          id: 469,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/toQCK34PPNPR45_v8mEIEbsNO-ZnlsTegNXG3-qP6W4/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzQyLzMuanBn.jpg',
              value: 3,
              description: 'Al menos un miembro de mi familia participa activamente en dos o más grupos de manera permanente, o uno o más miembros juegan un papel de liderazgo en un grupo.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/N2JyIOxDFyXwDF08K-_qMS8HIAleqNFaeupMc1_iKfg/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzQyLzIuanBn.jpg',
              value: 2,
              description: 'Al menos un miembro de mi familia participa activamente en un grupo de manera permanente.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/j9UGiBb6ht8_BDekZ3CdweTZQX2Qmw-i0qcxuua6gJ4/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzQyLzEuanBn.jpg',
              value: 1,
              description: 'Ningún miembro de mi familia participa en un grupo de manera activa y permanente.'
            }
          ],
          required: false
        },
        {
          questionText: 'Incidencia en el sector público',
          codeName: 'influenceInPublicSector',
          dimension: 'Organización y Participación',
          id: 470,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/F0WUqHHxOVH7dPkCtNBgJl8CisBhk_V5v0P1EM3Fj10/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzQzLzMuanBn.jpg',
              value: 3,
              description: 'Mi familia no tiene problemas que requieran de intervención del Estado, o si los tiene presenta una solicitud y le da seguimiento, o se ha organizado con otras personas que se encuentran en la misma situación para tener fuerza de grupo con la solicitud.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/nHyMlQefy5-Bn6r5bLpsUVWlEovuPmqhJOt86CPS2LY/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzQzLzIuanBn.jpg',
              value: 2,
              description: 'Mi familia tiene problemas que requieren de intervención del Estado. Presenta una solicitud, pero no le da seguimiento.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/aZsx-p1YHFt7AFTSIZHAO1wCojVrFJtMKT2svFKlWQg/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzQzLzEuanBn.jpg',
              value: 1,
              description: 'Mi familia tiene problemas que requieren de intervención del Estado, pero no presenta una solicitud.'
            }
          ],
          required: false
        },
        {
          questionText: 'Capacidad de resolver problemas y conflictos',
          codeName: 'abilityToSolveProblemsAndConflicts',
          dimension: 'Organización y Participación',
          id: 471,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/xvunV4sqUIOTcILXI3KVNI6AiYU8LjTJFnyU_W5GqJg/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzQ0LzMuanBn.jpg',
              value: 3,
              description: 'Cuando surge un problema o conflicto, los miembros de mi familia tienen una conversación sobre el asunto sin levantar la voz, sin violencia, sin preferir insultos, o pelearse con todas las personas involucradas y lo resuelven sin que este se agrave.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/mkFbo-8CAXsV24bHNqgwyWLr72TcGr30R_P6BxbG1kU/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzQ0LzIuanBn.jpg',
              value: 2,
              description: 'Cuando surge un problema o conflicto, los miembros de mi familia tienen una conversación sobre el asunto en la cual ocasionalmente se levanta la voz, intercambian insultos y hay violencia o peleas y este puede agravarse.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/nTUQz_heedup7a4LYraYue6yYMt3B_bMXKGT62rFQTY/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzQ0LzEuanBn.jpg',
              value: 1,
              description: 'Cuando surge un problema o conflicto, los miembros de mi familia frecuentemente tienen conversaciones en las cuales se levanta la voz, se intercambian insultos y y puede haber violencia o peleas.'
            }
          ],
          required: false
        },
        {
          questionText: 'Vota en elecciones',
          codeName: 'registeredToVoteAndVotesInElections',
          dimension: 'Organización y Participación',
          id: 472,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/RVvIXCDvO8HmzIHE3L4UhpAK7tBevQyYo4Kk8qp-pYM/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzQ1LzMuanBn.jpg',
              value: 3,
              description: 'Todos los adultos de mi familia votaron en las últimas elecciones de manera libre y consciente.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/ELS2eQShgC1X9P-eKsklGNxmEK1CwBHEp0OIJIoTu-8/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzQ1LzIuanBn.jpg',
              value: 2,
              description: 'Solo algunos adultos de mi familia votaron en las últimas elecciones y/o algunos lo hacen de manera condicionada.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/IEWJt0jC9gQtp6eXu5fGq8wlI-M3bdYkYFDEFMCFFNA/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzQ1LzEuanBn.jpg',
              value: 1,
              description: 'No todos los adultos de mi familia votaron en las últimas elecciones o si todos votaron, lo hicieron de manera condicionada.'
            }
          ],
          required: false
        },
        {
          questionText: 'Conciencia de sus necesidades',
          codeName: 'awarenessOfNeeds',
          dimension: 'Interioridad y Motivación',
          id: 473,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/yuUUHAUJHcfHas3OJzBl4Plb4Ts7TFrI5JlhU6sYp7g/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzQ2LzMuanBn.jpg',
              value: 3,
              description: 'Mi familia sabe que puede mejorar su situación actual. Para ello, tiene metas alcanzables en el mediano plazo (seis meses) y largo plazo (un año o más). Realiza acciones continuamente para lograrlas.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/qWum4k7xynJe2H8F6haOyvmL1aCmWS3cdsTIwxkL-8I/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzQ2LzIuanBn.jpg',
              value: 2,
              description: 'Mi familia piensa que puede mejorar su situación actual, pero no tiene metas a mediano (seis meses) y a largo plazo (un año o más).'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/I-7qUmrJf8jJ2KQXkHPIprIHOvwEjGaSnpZdL_5xNRA/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzQ2LzEuanBn.jpg',
              value: 1,
              description: 'Mi familia piensa que no puede mejorar su situación actual o no lo quiere hacer o no las comprende y en consecuencia no tiene metas de corto ni largo plazo.'
            }
          ],
          required: false
        },
        {
          questionText: 'Confianza en sí misma',
          codeName: 'selfEsteem',
          dimension: 'Interioridad y Motivación',
          id: 474,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/nq18vs5zac28tiYT-1cbrSZM5_Gro2iHPQAW4BqGFCQ/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzQ3LzMuanBn.jpg',
              value: 3,
              description: 'Generalmente, me siento capacitado, y la mayor parte de las veces tengo un sentimiento de logro o frecuentemente la gente me dice que soy competente o capaz en lo que hago.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/hd8fgF-h2WxWlJ9AQXUZFJJ-LdnzwW7aaxaZl9DyiYs/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzQ3LzIuanBn.jpg',
              value: 2,
              description: 'A veces me siento apto y tengo un sentimiento de logro por lo que hago, pero con la misma frecuencia me siento incapaz o no es frecuente que la gente diga que soy competente o capaz en lo que hago.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/esJh9i30XRifpr8s1CfB-4qiTVjaaz0gTqfVKHomRIw/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzQ3LzEuanBn.jpg',
              value: 1,
              description: 'No me siento apto, y casi nunca logro lo que quiero. No creo que me admiren por lo que hago.'
            }
          ],
          required: false
        },
        {
          questionText: 'Conciencia moral',
          codeName: 'moralConscience',
          dimension: 'Interioridad y Motivación',
          id: 475,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/H9-TCaewkQs2tYM796EAbOn6_HivC_jesxI2_CPseus/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzQ4LzMuanBn.jpg',
              value: 3,
              description: 'Mi familia toma decisiones teniendo en cuenta a quienes afectarían las consecuencias de sus acciones.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/pY1F2IieyMVO816Gh8nMiRnl58I_jRsSzkujKpM5D3s/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzQ4LzIuanBn.jpg',
              value: 2,
              description: 'Mi familia toma decisiones, muchas veces, sin tener en cuenta a quienes afectarían las consecuencias de las acciones.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/3cTSte9bv5nIhuJtcnXxxQKme17cwWpDCWvRg_ULpi4/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzQ4LzEuanBn.jpg',
              value: 1,
              description: 'Mi familia actúa pensando solo en sí misma, no sabe que las consecuencias de sus acciones pueden afectar a los demás.'
            }
          ],
          required: false
        },
        {
          questionText: 'Capacidad emocional-afectiva',
          codeName: 'emotionalIntelligence',
          dimension: 'Interioridad y Motivación',
          id: 476,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/XcZwfsR2FihjKo9mYXxNMxj4gKTHWukjS_BNBU7LArc/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzQ5LzMuanBn.jpg',
              value: 3,
              description: 'Entiendo que emociones como la ira, la tristeza, el temor o los celos pueden tener una influencia negativa en mi vida y que hay formas de controlarlas. En general, logro controlarlas, y trato de no tomar acciones o decisiones en el acaloramiento del momento.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/8d9AiGw2_HVwHOvYFTipQJzlWKBFei3en-QaZGdyQV0/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzQ5LzIuanBn.jpg',
              value: 2,
              description: 'Entiendo que emociones como la ira, la tristeza, el temor o los celos pueden tener una influencia negativa en mi vida, y que hay formas de controlarlas. Sin embargo, muchas veces me cuesta, y mis emociones me llevan a cometer hechos de los que más tarde me arrepiento.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/G5z-kmYkk7EG429hjpMQlI47MZBwcVsRI0-y_RMcB5U/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzQ5LzEuanBn.jpg',
              value: 1,
              description: 'Las emociones como la ira, la tristeza, el temor, los celos, son constantes en mi vida y determinan mis acciones. No hay nada que uno pueda hacer para influir en eso (no hay forma de controlarlas).'
            }
          ],
          required: false
        },
        {
          questionText: 'Violencia intrafamiliar',
          codeName: 'householdViolence',
          dimension: 'Interioridad y Motivación',
          id: 477,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/UYkA2EWQM5TpqMjVsqosUjMNrBJHIbFSIjg9UsE_b_M/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzUwLzMuanBn.jpg',
              value: 3,
              description: 'Ningún miembro de mi familia es objeto de violencia intrafamiliar.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/IbD1ZXtBbLMlQf4Vow0j4Io_O7Cv-k4iDgzyW18WTX4/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzUwLzIuanBn.jpg',
              value: 2,
              description: 'Existe violencia en mi familia. La víctima la ve como una agresión y toma acciones para evitarla (líneas telefónica de denuncia, botón de pánico).'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/Wsme6MWZMLgKCrMq74po6jv5HZUJd4AsQhRjMIDmx5I/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzUwLzEuanBn.jpg',
              value: 1,
              description: 'Existe violencia en mi familia y no se toma alguna acción para evitarla.'
            }
          ],
          required: false
        },
        {
          questionText: 'Espíritu emprendedor',
          codeName: 'entrepreneurialSpirit',
          dimension: 'Interioridad y Motivación',
          id: 478,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/HKZR9bOjFOCABqKtWVCTb757a9ffSJaW12hH1YHr7PM/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzUxLzMuanBn.jpg',
              value: 3,
              description: 'Al menos dos miembros de mi familia tienen espíritu emprendedor, no se conforman con la situación actual y hacen algo para cambiarla.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/QFptZL1iu2S1r8M7S8FdNWOu7uBXlFYczB4POsVdjyA/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzUxLzIuanBn.jpg',
              value: 2,
              description: 'Un miembro de mi familia tiene espíritu emprendedor, no se conforma con la situación actual y quiere cambiarla.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/HyG0CifPC1_YZgmZsM63xm8HU2vY5ToGVHl7K39OHrQ/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzUxLzEuanBn.jpg',
              value: 1,
              description: 'Los miembros de mi familia no emprenden nada nuevo. Piensan que nada puede cambiar, o no tienen iniciativa para cambiar y tienen actitud conformista.'
            }
          ],
          required: false
        },
        {
          questionText: 'Autonomía y capacidad de tomar decisiones',
          codeName: 'autonomyDecisions',
          dimension: 'Interioridad y Motivación',
          id: 479,
          stoplightColors: [
            {
              url: 'https://penguin-imgproxy.herokuapp.com/lHkJDY7aHNsXx7oD-nHK080t8CEml16BVJThHy5LiWA/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzUyLzMuanBn.jpg',
              value: 3,
              description: 'Tomo las decisiones en los aspectos claves de mi vida y participó activamente en las decisiones de la familia. Estas decisiones reflejan lo que valoro, sé que hay restricciones, pero dentro de estos formo mi propia vida.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/J3FevaLzGWtYnbiCRxHQHst5ZSLg6kmnoKYP2uXObUw/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzUyLzIuanBn.jpg',
              value: 2,
              description: 'Tomo algunas decisiones en los aspectos claves de mi vida y participo en algunas decisiones de mi familia. Algunas decisiones reflejan lo que valoro y otras son tomadas, principalmente, para complacer a otros o evitar consecuencias negativas.'
            },
            {
              url: 'https://penguin-imgproxy.herokuapp.com/VsSeOqwDav9Agh1GnZopEhGKq9Ujy7-MEIRkNKZl6Yo/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL2FyZ2VudGluYS9pcnJhZGlhLzUyLzEuanBn.jpg',
              value: 1,
              description: 'No tomo las decisiones en los aspectos claves de mi vida. Hago lo que me dicen y mis decisiones son para complacer a otros o evitar consecuencias negativas.'
            }
          ],
          required: false
        }
      ]
    }
  ]