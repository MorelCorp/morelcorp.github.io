---
layout: planprism
permalink: /planprism/architecture/
title: "System Architecture"
description: "Technical and high-level overview of the PlanPrism application architecture, including system components, data flow, and deployment strategies."
---

# PlanPrism - High Level Architecture

> **Note:** This architecture documentation was built with AI assistance and rendered with Mermaid diagrams to provide clear visual representations of the system components and data flows.

## System Overview

PlanPrism is a web application designed to help software development teams improve their sprint planning accuracy and transparency. It integrates with Jira and uses a range-based estimation approach (Original Estimate + Confidence %) to provide clearer, more actionable insights than traditional story points alone.

---

## Core Architecture Components

### 1. System Architecture Overview

The overall system architecture consists of a React frontend, Go backend API, MongoDB database, and integration with external Jira services.

[![](https://mermaid.ink/img/pako:eNp9VFuPmkAU_itkHpo28QICYkmziaJrbGs0oi-FPszCiBNxxgzD7lrjf-9ccEVJlgc4l-87c875gDNIaIqADzIGjztjPYqJIa6ifNGBGAQ5RoQbv-EJsRjotLw2s2iFYMKNcDn88cK6T8EO7hkUceWtT0cUJgwf-d8bZ0VLjljF044Cd40vRjehZIuzCo1IGpNGLyOY7EWm2cxwOYumVD6MELHXquwUE-OZwQN6o2xfa2NY8l20kPeeguMEKfzyVzAxnnP6VsP-xAzqFUTSNLSt4KtJuJZH1tATkrDTkUfVE1Nyd8BwErZ7br89DeafzjmGHDaHnFOS0fEo-loZqmR1EkqNkFMGM_St1k6IikL0IDMoqhyF0-1sCsSumKJGC5QSmqXtJolzTLLi0ykm70JfAvPrCor6MHKZUrUhz6FoABIV0S9STsv0YbGLumZLRl9xWon8UaDZy2ZmtNtPspL25euhAqLKfeSmchUXCJVY3LA3zAelUblS5qFIXYZ7fG3TD5xKVx2twepJ0BKfLU6Bz1mJWuCA2AFKF5wlLQZ8hw4oBr4wU7SFZc6lAhdBO0Lyh9LDlclome2uTnlMIUdjDIWOArGFeSEhYq-IBbQkHPie46gawD-Dd-DbrtuxHM_97jmWZ5uOzJ6A37ZMq9MfDEzH7Fmm7Vm9waUF_qlzzY6Iu7bZd1174Jh922sBlGIx4Vz_j9Rv6fIffVpuXw?type=png)](https://mermaid.live/edit#pako:eNp9VFuPmkAU_itkHpo28QICYkmziaJrbGs0oi-FPszCiBNxxgzD7lrjf-9ccEVJlgc4l-87c875gDNIaIqADzIGjztjPYqJIa6ifNGBGAQ5RoQbv-EJsRjotLw2s2iFYMKNcDn88cK6T8EO7hkUceWtT0cUJgwf-d8bZ0VLjljF044Cd40vRjehZIuzCo1IGpNGLyOY7EWm2cxwOYumVD6MELHXquwUE-OZwQN6o2xfa2NY8l20kPeeguMEKfzyVzAxnnP6VsP-xAzqFUTSNLSt4KtJuJZH1tATkrDTkUfVE1Nyd8BwErZ7br89DeafzjmGHDaHnFOS0fEo-loZqmR1EkqNkFMGM_St1k6IikL0IDMoqhyF0-1sCsSumKJGC5QSmqXtJolzTLLi0ykm70JfAvPrCor6MHKZUrUhz6FoABIV0S9STsv0YbGLumZLRl9xWon8UaDZy2ZmtNtPspL25euhAqLKfeSmchUXCJVY3LA3zAelUblS5qFIXYZ7fG3TD5xKVx2twepJ0BKfLU6Bz1mJWuCA2AFKF5wlLQZ8hw4oBr4wU7SFZc6lAhdBO0Lyh9LDlclome2uTnlMIUdjDIWOArGFeSEhYq-IBbQkHPie46gawD-Dd-DbrtuxHM_97jmWZ5uOzJ6A37ZMq9MfDEzH7Fmm7Vm9waUF_qlzzY6Iu7bZd1174Jh922sBlGIx4Vz_j9Rv6fIffVpuXw)

**Key Components:**

- **Client Layer**: React SPA with Chakra UI and TypeScript
- **Backend Layer**: Go API Server with Gin Framework, OAuth2 Service, and Jira Client
- **Data Layer**: MongoDB with encrypted storage for sessions and configuration
- **External Services**: Atlassian Jira Cloud API and OAuth2 Provider

### 2. Authentication & Security Flow

PlanPrism implements a secure OAuth2 authentication flow with PKCE (Proof Key for Code Exchange) for enhanced security.

[![](https://mermaid.ink/img/pako:eNqVlMGO2jAQhl_F8mlXBZSQhFAfkCDQFW3ZrkrpocrFckywNtip46i7i3j3jh0CLKBK5RLi-eafPzOT7DBTGccEV_x3zSXjU0FzTbepRPArqTaCiZJKg1aIVmhVcX0jNLex75wygz5pJQ2X2TU1fnLYg0ITyp5vIt_GtdlYaGwKWlWCyubomvwsNLWgu4LyNTGd2PhCyVxNJ6lsgFV3NFrNCRozxisoU5aFYNQI1cbnAIAcQcmGs2fk_CwNNXXVABADYjoh6CctREYNR0tQOgrY-KHGozIun0tja_Ds0kQCtZ_RV5WLq-pzKYyw4meP35R2B8QJKy3enHdoPQyvMuju6Usyu29wBzovBOKZ0BymY9SptSczZ5qt2QsNZ-p9zQT25oax2QvbUJlzF0drpdEPBcOubgo2U_gA_taaV5sjeq7ryJlk-rU0BwDdjWfLbj8adB-Sxf3lYJZGad5m8Oxd_ROVaP6v4R079kfYDWipyznZnT40_z8WZDSya0uOy4sSWhSHfHt2bJADptTQK39nm-sA3MG5FhkmRte8g7dcb6m9xTubmmKY7JanmMDfjK9pXZgUp3IPafCy_FJq22ZqVeeb9qYu7QMcPgmYrGlRWQTeXa4TVUuDSRwOnQYmO_yCSRBFPT-Mo49x6MeBF4ZhB79i0vU9vzcYDr3Q6_teEPv94b6D31xdrwfnUeANoigYht4giDsYug9TXDSfJveF2v8Fccl0xQ?type=png)](https://mermaid.live/edit#pako:eNqVlMGO2jAQhl_F8mlXBZSQhFAfkCDQFW3ZrkrpocrFckywNtip46i7i3j3jh0CLKBK5RLi-eafPzOT7DBTGccEV_x3zSXjU0FzTbepRPArqTaCiZJKg1aIVmhVcX0jNLex75wygz5pJQ2X2TU1fnLYg0ITyp5vIt_GtdlYaGwKWlWCyubomvwsNLWgu4LyNTGd2PhCyVxNJ6lsgFV3NFrNCRozxisoU5aFYNQI1cbnAIAcQcmGs2fk_CwNNXXVABADYjoh6CctREYNR0tQOgrY-KHGozIun0tja_Ds0kQCtZ_RV5WLq-pzKYyw4meP35R2B8QJKy3enHdoPQyvMuju6Usyu29wBzovBOKZ0BymY9SptSczZ5qt2QsNZ-p9zQT25oax2QvbUJlzF0drpdEPBcOubgo2U_gA_taaV5sjeq7ryJlk-rU0BwDdjWfLbj8adB-Sxf3lYJZGad5m8Oxd_ROVaP6v4R079kfYDWipyznZnT40_z8WZDSya0uOy4sSWhSHfHt2bJADptTQK39nm-sA3MG5FhkmRte8g7dcb6m9xTubmmKY7JanmMDfjK9pXZgUp3IPafCy_FJq22ZqVeeb9qYu7QMcPgmYrGlRWQTeXa4TVUuDSRwOnQYmO_yCSRBFPT-Mo49x6MeBF4ZhB79i0vU9vzcYDr3Q6_teEPv94b6D31xdrwfnUeANoigYht4giDsYug9TXDSfJveF2v8Fccl0xQ)

**Security Features:**

- OAuth2 with PKCE for secure authentication
- AES-256-GCM encryption for sensitive data storage
- Session-based authentication with secure cookies
- CORS protection and request validation

### 3. Data Flow Architecture

The application follows a clean data flow pattern with clear separation between frontend components, hooks, backend services, and data stores.

[![](https://mermaid.ink/img/pako:eNp9VF1vmzAU_SuWnzotSSFAkqGpUks3rVOromXbw6APLjjEKtjImG1dlP8-f-DEbGl5CL6-59j3nnvCDhasxDCGFUftFtx-ySmQT9c_mo0cfuSMCkxLkLCmZRRT0eXQoNST1ohSzLPhDb4T_Ov9Iz-_uEOEghtJ5RtU4IcjI2F0Q6rMvECKKqzxaywEoVXnIC97sc3Uj3O3xt6yitDzlLMNqe3RssScvlz9J8aeRoV_JhxdI4GyvsN2rQ-_TG_UfU1PSYEEYdSpaN1yQkWC6kLRjlFfI8G4pt9Pk-n9NAWqxsJtpm2HziXzEAztFKgGJwQYRF0LJLCiubFmpph3pJMNFq_LcIWKJ6XCGvOfpMAjIZTAw74RewhMN2pnDt7Kza6TWrjVKdUsUa1HRKWimr6s4B8NTeOWONjApX7rpI9OqGHktkQTjYhaHkkCapav6qEAYC1HNpbCNpmd2ZWxMqMVu756818TEqiLHaKXwB9owZ9bgcvs7LAEX5mcyEmKU7L9V02nFwfDmsygm0oczGQyeoZjgknY2JCOUz-RdUY7HGrv0OnRCEeVamtqzGhatgTnVgMaZD6dPYjltuwCBt2PDbhJFUsXGmsmNetLIMMHOJHfOlLCWPAeT2CDeYNUCHfqmByKLW5wDmO5LPEG9bVQDtlLWovoD8Yay-Ssr7Y26NtSNn5NkHSYRGxQ3SmIHCXmCeupgPEymuszYLyDv2EcRNHMD5fRu2XoLwMvDMMJfIbx1Pf82WK18kJv7nvB0p-v9hP4R9_rzeR-FHiLKApWobcIVhOISyJtfGc-4vpbvv8LOmPjyQ?type=png)](https://mermaid.live/edit#pako:eNp9VF1vmzAU_SuWnzotSSFAkqGpUks3rVOromXbw6APLjjEKtjImG1dlP8-f-DEbGl5CL6-59j3nnvCDhasxDCGFUftFtx-ySmQT9c_mo0cfuSMCkxLkLCmZRRT0eXQoNST1ohSzLPhDb4T_Ov9Iz-_uEOEghtJ5RtU4IcjI2F0Q6rMvECKKqzxaywEoVXnIC97sc3Uj3O3xt6yitDzlLMNqe3RssScvlz9J8aeRoV_JhxdI4GyvsN2rQ-_TG_UfU1PSYEEYdSpaN1yQkWC6kLRjlFfI8G4pt9Pk-n9NAWqxsJtpm2HziXzEAztFKgGJwQYRF0LJLCiubFmpph3pJMNFq_LcIWKJ6XCGvOfpMAjIZTAw74RewhMN2pnDt7Kza6TWrjVKdUsUa1HRKWimr6s4B8NTeOWONjApX7rpI9OqGHktkQTjYhaHkkCapav6qEAYC1HNpbCNpmd2ZWxMqMVu756818TEqiLHaKXwB9owZ9bgcvs7LAEX5mcyEmKU7L9V02nFwfDmsygm0oczGQyeoZjgknY2JCOUz-RdUY7HGrv0OnRCEeVamtqzGhatgTnVgMaZD6dPYjltuwCBt2PDbhJFUsXGmsmNetLIMMHOJHfOlLCWPAeT2CDeYNUCHfqmByKLW5wDmO5LPEG9bVQDtlLWovoD8Yay-Ssr7Y26NtSNn5NkHSYRGxQ3SmIHCXmCeupgPEymuszYLyDv2EcRNHMD5fRu2XoLwMvDMMJfIbx1Pf82WK18kJv7nvB0p-v9hP4R9_rzeR-FHiLKApWobcIVhOISyJtfGc-4vpbvv8LOmPjyQ)

**Frontend Architecture:**

- **Components**: Planner View, Config Page, Auth Components
- **Hooks**: useJiraData, useSprintCalculator, useAppConfig, usePlannerState
- **State Management**: React Context API with custom hooks

### 4. O-C-O-P Estimation Logic

The core of PlanPrism is the O-C-O-P (Optimistic-Current-Optimistic-Pessimistic) estimation methodology.

[![](https://mermaid.ink/img/pako:eNp9VUtu2zAQvQpBIF35I8WS7QpFgEBO0SyCGLXRReUuaIuxCUikwE9Qx8g5epQeoBcrP5JF-RNtOOTMvOEbPlIHuGE5hgncclTtwHK2okB_Qq3dwgo-0kpJMEMSraBzmu-Zky2hqMgaAzwISUok8Zc1H959Y4qLX214yugLyTHd4Kw1wY2NDfthEHixS4zKFFWZGYE20IbI_UXUGRaE49wgZrXtVbIpi0JPeJ2Dab6iZwRTVGxUgSRhFDxQTQZ3iFaaFtHcNllrdskeW_Dvj1f-xtvoHAvRoHj2NZi_V2CWO47FjhV5drS6EF8ZB-eN-JD9ouKESjAvEKWEbn3qqZKF7kZWj2DOBDFdsqXulWTDJ0QVKrwdOrRHIRQWmRsAofWyy1uzV9xA-9yYRIU5isxawDsV4dpz7P7Qa2FHY6VWai2HZnKqh_uN1DsGr6Lp04fN-UGEjiZvdht-ayy1FPG8Zgms7fbZT_vP_TmYEVEVaH_WnIUqS8T3Wd34empTLXMBPp2fnVU7R9sZZ1VmDB1kbJvmdvAdM66lrs_wnNJRWv3-nafoC06vtc7rXddLySfuTnoN394aE3FUrvP6t-GC27vhp24X0F4E465lVbvcO3LuaPRsHL5gG0x_zVVttFkDN1MH7cnuQuGO9wp-q6ZLBTqyuYLQaAP29ENOcphIrnAPlpiXyEzhwSSuoNzhUj9viTZz_IJUIY2q33VahehPxsomkzO13TUTVeX6hZkRpO9FG6H1hXnKFJUwmcRjCwGTA_wNk1EcD8JoEn-eROFkFERR1IN7mOiHPhyMp9MgCm7DYDQJb6fvPfhmywYDvR6PgnEcj6ZRMB5NexDnRDL-5H5Q9j_1_h9U3zQS?type=png)](https://mermaid.live/edit#pako:eNp9VUtu2zAQvQpBIF35I8WS7QpFgEBO0SyCGLXRReUuaIuxCUikwE9Qx8g5epQeoBcrP5JF-RNtOOTMvOEbPlIHuGE5hgncclTtwHK2okB_Qq3dwgo-0kpJMEMSraBzmu-Zky2hqMgaAzwISUok8Zc1H959Y4qLX214yugLyTHd4Kw1wY2NDfthEHixS4zKFFWZGYE20IbI_UXUGRaE49wgZrXtVbIpi0JPeJ2Dab6iZwRTVGxUgSRhFDxQTQZ3iFaaFtHcNllrdskeW_Dvj1f-xtvoHAvRoHj2NZi_V2CWO47FjhV5drS6EF8ZB-eN-JD9ouKESjAvEKWEbn3qqZKF7kZWj2DOBDFdsqXulWTDJ0QVKrwdOrRHIRQWmRsAofWyy1uzV9xA-9yYRIU5isxawDsV4dpz7P7Qa2FHY6VWai2HZnKqh_uN1DsGr6Lp04fN-UGEjiZvdht-ayy1FPG8Zgms7fbZT_vP_TmYEVEVaH_WnIUqS8T3Wd34empTLXMBPp2fnVU7R9sZZ1VmDB1kbJvmdvAdM66lrs_wnNJRWv3-nafoC06vtc7rXddLySfuTnoN394aE3FUrvP6t-GC27vhp24X0F4E465lVbvcO3LuaPRsHL5gG0x_zVVttFkDN1MH7cnuQuGO9wp-q6ZLBTqyuYLQaAP29ENOcphIrnAPlpiXyEzhwSSuoNzhUj9viTZz_IJUIY2q33VahehPxsomkzO13TUTVeX6hZkRpO9FG6H1hXnKFJUwmcRjCwGTA_wNk1EcD8JoEn-eROFkFERR1IN7mOiHPhyMp9MgCm7DYDQJb6fvPfhmywYDvR6PgnEcj6ZRMB5NexDnRDL-5H5Q9j_1_h9U3zQS)

**Estimation Process:**

1. **Input**: Original Estimate (hours), Confidence %, Team Capacity, Desired Confidence
2. **Calculation**: Optimistic (Original × Confidence%), Pessimistic (Original ÷ Confidence%)
3. **Planning**: Cutline positioning, issue selection, total calculations
4. **Visualization**: Issue cards, sprint summary, drag & drop interface

### 5. Deployment Architecture

PlanPrism is designed for production deployment on Oracle Cloud with containerized services.

[![](https://mermaid.ink/img/pako:eNqNlN9v2jAQx_8Vyy9rJdolJCEsmiq10E6dYKCl7cMCDyY5wFtio4uDYBX_-xwnUEiZ1Dyg-_X1faw7_EpjmQAN6ALZakme7iaC6C8vZlVgQscokyJWXArSh1UqtxkIRS5GyOIUSC-VRXI5oZWsIX1AKRSI5DhdfqET1fLR7DfEioRKIlvA1xl-vgkVUzwmDzyFfHqq-7HgYhOZX1P6E9aAORCNuNke1ZYtxVmiOxb_OQP0MoyeZ4VQhbbMyd8k6Wl2xgVgA6I-4nb8GNUm0bZRjSUq4liW_SGWPlNsxnJowgylWMj-nWYaI18zBXuoOvFfsjofXdTGG1Pbt2z_8kNUj2KOLFeoR17gO7YnQGRziVl0sEyXUxVhuYZMoMEXhoNoAOpTTu5FjNuVquYdDkgPUPE5j_Vlm5AN2iPS-40CFCwlIeCax5Afw37nyMxuRrcqZXnOmTAx09IkyqkdNRvdFmqpF2nNE8DIeG2y943qcND0HdVzrjX3ehNKY0qurm6qXa2yxjTB0GlG3rapyrz5Jl1P8mzucMWz2ZP77DkPQzMlL8Nz0cP6VclyPIf70JZ-J3hCAz1paNEMMGOlS1_L4glVS8j0zgTaTGDOilSVM9lp2YqJX1JmeyXKYrHcO8Uq0YPvc6YnqyvmLM3LEn0ZwJ7Uf0sa-B3LnEGDV7qhgeN517bre1981_Ydy3XdFt3S4Mq27OtOt2u5Vtu2HN9ud3ct-tf0ta513HOsjuc5XdfqOH6LQsL1wzOsHkDzDu7-AS2Oikg?type=png)](https://mermaid.live/edit#pako:eNqNlN9v2jAQx_8Vyy9rJdolJCEsmiq10E6dYKCl7cMCDyY5wFtio4uDYBX_-xwnUEiZ1Dyg-_X1faw7_EpjmQAN6ALZakme7iaC6C8vZlVgQscokyJWXArSh1UqtxkIRS5GyOIUSC-VRXI5oZWsIX1AKRSI5DhdfqET1fLR7DfEioRKIlvA1xl-vgkVUzwmDzyFfHqq-7HgYhOZX1P6E9aAORCNuNke1ZYtxVmiOxb_OQP0MoyeZ4VQhbbMyd8k6Wl2xgVgA6I-4nb8GNUm0bZRjSUq4liW_SGWPlNsxnJowgylWMj-nWYaI18zBXuoOvFfsjofXdTGG1Pbt2z_8kNUj2KOLFeoR17gO7YnQGRziVl0sEyXUxVhuYZMoMEXhoNoAOpTTu5FjNuVquYdDkgPUPE5j_Vlm5AN2iPS-40CFCwlIeCax5Afw37nyMxuRrcqZXnOmTAx09IkyqkdNRvdFmqpF2nNE8DIeG2y943qcND0HdVzrjX3ehNKY0qurm6qXa2yxjTB0GlG3rapyrz5Jl1P8mzucMWz2ZP77DkPQzMlL8Nz0cP6VclyPIf70JZ-J3hCAz1paNEMMGOlS1_L4glVS8j0zgTaTGDOilSVM9lp2YqJX1JmeyXKYrHcO8Uq0YPvc6YnqyvmLM3LEn0ZwJ7Uf0sa-B3LnEGDV7qhgeN517bre1981_Ydy3XdFt3S4Mq27OtOt2u5Vtu2HN9ud3ct-tf0ta513HOsjuc5XdfqOH6LQsL1wzOsHkDzDu7-AS2Oikg)

**Production Infrastructure:**

- **Frontend**: Oracle Object Storage with Nginx reverse proxy
- **Backend**: Ubuntu VM running Go container on port 3001
- **Database**: Private VM with MongoDB container on port 27017
- **Infrastructure**: Terraform IaC with Let's Encrypt SSL

### 6. Component Interaction Flow

The complete user interaction flow from authentication to sprint planning.

[![](https://mermaid.ink/img/pako:eNqFVk1z2jAQ_SsaHXopZCBASH3IDIEkQ6dpmLj00OGysRejREhUlvPRTP57V5ZNbOO0XMDs2923-3Ylv_JIx8gDnuLvDFWEMwGJge1KMfrswFgRiR0oy5YMUrZM0bSY5s52ixBZdmm0sqjiQ9RkkcOuNDuH6KEV8lUYcJj8m_CHiNm5s19rlejZ-Up5wHdtkelHNGzZmZ0HbK6EFSDZNw0x-8Qmmd2gohBghS5clt2zs-U8YJMowjRlk91O1u1zAhCDgE03GD3kMVhowWapB5CNEC7bT5AiBmIQUqR9AGcvc7z7ss95C4nhWpfsQVpXQZUmFr3ZM1kGLNzoJ6ooEYrKj0FWEEWeKZXw4CEN97wQ3xXieZMTupT66R3my6E0txgLgySk1WxiJVBJoOq58mg-yBSkvCM1m4GcgAG7eI42oBJkU5oxttaG_dAkfNpEuy6GVhtkFyoyLzuqvxVZ1Lmn-CRcY6tdz6eqfSimWq1FkplcZK9qU-pLtNHGC-TRTamv0FbNRbADwfPxDdFaoRIn-aVAGbP5LK1Kfi2It0raQlVlr-rhoWwBCbaoX8TBevq2SQjhET_K21TkoBv_aHG4M4J2dCFBKcrd3t6F0fdUT22N_Ljsu1uHOGO3jFGY2DeR2sNFewQh4U5iJUJ93UOUzrswtxP0VXzAr8xfA9UYFk34D8G9fys_b22nN0_TDD9gV-SuQkpuLnr-P5uBBb86N91p96a7-EjOUkc6OSwaOtxpUNLG8RnfZymdypjSkMZ-TmJ3jVS4-5WNQEaZdMfPNLNSKNJIp6Jx4DrocucPU19KmG23YF6afZoZSIoy3WLcojZxeTM15twXffNub054DdCSpuDbGry9lmaGJop3eGJEzANrMuzwLZotuEf-6vxXnO6BLa54QD9jXEMm7Yqv1Bu50R34S-tt6Wl0lmzKhyxvXHF_82ANMnUQ2lc0U50py4PxyTCPwYNX_syDwWh01B-OR1_Gw_540BsOyfrCg26_1z86OT3tDXvH_d5g3D8-fevwP3ne3hH9Pxr0TkajwemwdzIYdzidUFTmtX-PyF8n3v4CRC6Vlw?type=png)](https://mermaid.live/edit#pako:eNqFVk1z2jAQ_SsaHXopZCBASH3IDIEkQ6dpmLj00OGysRejREhUlvPRTP57V5ZNbOO0XMDs2923-3Ylv_JIx8gDnuLvDFWEMwGJge1KMfrswFgRiR0oy5YMUrZM0bSY5s52ixBZdmm0sqjiQ9RkkcOuNDuH6KEV8lUYcJj8m_CHiNm5s19rlejZ-Up5wHdtkelHNGzZmZ0HbK6EFSDZNw0x-8Qmmd2gohBghS5clt2zs-U8YJMowjRlk91O1u1zAhCDgE03GD3kMVhowWapB5CNEC7bT5AiBmIQUqR9AGcvc7z7ss95C4nhWpfsQVpXQZUmFr3ZM1kGLNzoJ6ooEYrKj0FWEEWeKZXw4CEN97wQ3xXieZMTupT66R3my6E0txgLgySk1WxiJVBJoOq58mg-yBSkvCM1m4GcgAG7eI42oBJkU5oxttaG_dAkfNpEuy6GVhtkFyoyLzuqvxVZ1Lmn-CRcY6tdz6eqfSimWq1FkplcZK9qU-pLtNHGC-TRTamv0FbNRbADwfPxDdFaoRIn-aVAGbP5LK1Kfi2It0raQlVlr-rhoWwBCbaoX8TBevq2SQjhET_K21TkoBv_aHG4M4J2dCFBKcrd3t6F0fdUT22N_Ljsu1uHOGO3jFGY2DeR2sNFewQh4U5iJUJ93UOUzrswtxP0VXzAr8xfA9UYFk34D8G9fys_b22nN0_TDD9gV-SuQkpuLnr-P5uBBb86N91p96a7-EjOUkc6OSwaOtxpUNLG8RnfZymdypjSkMZ-TmJ3jVS4-5WNQEaZdMfPNLNSKNJIp6Jx4DrocucPU19KmG23YF6afZoZSIoy3WLcojZxeTM15twXffNub054DdCSpuDbGry9lmaGJop3eGJEzANrMuzwLZotuEf-6vxXnO6BLa54QD9jXEMm7Yqv1Bu50R34S-tt6Wl0lmzKhyxvXHF_82ANMnUQ2lc0U50py4PxyTCPwYNX_syDwWh01B-OR1_Gw_540BsOyfrCg26_1z86OT3tDXvH_d5g3D8-fevwP3ne3hH9Pxr0TkajwemwdzIYdzidUFTmtX-PyF8n3v4CRC6Vlw)

**User Journey:**

1. **Authentication**: OAuth2 flow with Atlassian
2. **Configuration**: Jira settings and field mapping
3. **Project Selection**: Fetch available projects and sprints
4. **Planning**: Issue loading, estimation, and sprint organization

---

## Key Architectural Patterns

### 1. **Security-First Design**

- OAuth2 with PKCE for secure authentication
- AES-256-GCM encryption for sensitive data
- Session-based authentication with secure cookies
- CORS protection and request validation

### 2. **Microservices Architecture**

- Separate frontend (React) and backend (Go) services
- Containerized deployment with Docker
- Independent scaling and deployment

### 3. **State Management**

- React Context API for global state
- Custom hooks for domain-specific logic
- Backend persistence for user preferences
- Real-time synchronization between components

### 4. **Data Flow**

- Unidirectional data flow in React components
- Centralized API communication layer
- Encrypted data storage in MongoDB
- Caching and optimization strategies

### 5. **Deployment Strategy**

- Infrastructure as Code with Terraform
- Container orchestration with Docker Compose
- SSL/TLS encryption with Let's Encrypt
- Health checks and monitoring

---

## Technology Stack

### Frontend

- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **UI Library**: Chakra UI
- **State Management**: React Context API + Custom Hooks
- **Drag & Drop**: dnd-kit
- **HTTP Client**: Axios
- **Routing**: React Router DOM

### Backend

- **Language**: Go 1.21+
- **Framework**: Gin Web Framework
- **Database**: MongoDB
- **Authentication**: OAuth2 with PKCE
- **Encryption**: AES-256-GCM
- **Testing**: Go testing with gotestsum

### Infrastructure

- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Cloud Provider**: Oracle Cloud (Free Tier)
- **Infrastructure as Code**: Terraform
- **Reverse Proxy**: Nginx
- **SSL**: Let's Encrypt

### External Integrations

- **Jira**: Atlassian Cloud API
- **OAuth**: Atlassian OAuth2 Provider
- **Storage**: Oracle Object Storage

---

This architecture provides a robust, scalable, and secure foundation for the PlanPrism sprint planning application, with clear separation of concerns and modern development practices.

For more details, see the [Confidence Method](/planprism/confidence-method/) or [Setup Guide](/planprism/setup/).
