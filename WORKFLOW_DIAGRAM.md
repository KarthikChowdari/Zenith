# Project Zenith - System Workflow Diagram

## 🏗️ Architecture Overview

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Web Browser]
        Clerk[Clerk Auth Service]
    end
    
    subgraph "Frontend - React App :3000"
        Landing[Landing Page]
        Login[Login/Signup]
        Router[React Router]
        UserContext[UserContext Provider]
        RoleRoutes[Role-Based Routes]
        
        subgraph "Dashboards"
            AdminDash[Admin Dashboard]
            OfficerDash[Loan Officer Dashboard]
            BeneficiaryDash[Beneficiary Dashboard]
            ManagerDash[Bank Manager Dashboard]
        end
        
        API[API Client axios]
    end
    
    subgraph "Backend - FastAPI :8000"
        FastAPI[FastAPI Server]
        
        subgraph "Core Modules"
            MainPy[main.py - Endpoints]
            ModelPy[model.py - ML Engine]
            ExplainerPy[explainer.py - SHAP AI]
            DatabasePy[database.py - Repositories]
        end
        
        subgraph "ML Components"
            SGD[SGDClassifier Model]
            Scaler[StandardScaler]
            SHAP[SHAP Explainer]
            JobLib[Model Artifacts .joblib]
        end
    end
    
    subgraph "Data Layer"
        Supabase[(Supabase PostgreSQL)]
        
        subgraph "Database Tables"
            Users[users table]
            Beneficiaries[beneficiaries table]
            ScoreHistory[score_history table]
        end
    end
    
    Browser --> Landing
    Browser --> Login
    Login --> Clerk
    Clerk --> UserContext
    UserContext --> Router
    Router --> RoleRoutes
    RoleRoutes --> AdminDash
    RoleRoutes --> OfficerDash
    RoleRoutes --> BeneficiaryDash
    RoleRoutes --> ManagerDash
    
    AdminDash --> API
    OfficerDash --> API
    BeneficiaryDash --> API
    ManagerDash --> API
    
    API --> FastAPI
    FastAPI --> MainPy
    MainPy --> ModelPy
    MainPy --> ExplainerPy
    MainPy --> DatabasePy
    
    ModelPy --> SGD
    ModelPy --> Scaler
    ModelPy --> JobLib
    ExplainerPy --> SHAP
    ExplainerPy --> ModelPy
    
    DatabasePy --> Supabase
    Supabase --> Users
    Supabase --> Beneficiaries
    Supabase --> ScoreHistory
    
    style Browser fill:#e1f5ff
    style Clerk fill:#ffeb3b
    style FastAPI fill:#4caf50
    style Supabase fill:#2196f3
    style SGD fill:#ff9800
    style SHAP fill:#9c27b0
```

## 🔄 User Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Clerk
    participant Backend
    participant Database
    
    User->>Frontend: Visit /login
    Frontend->>Clerk: Initiate auth
    Clerk->>User: Show login form
    User->>Clerk: Enter credentials
    Clerk->>Frontend: Return JWT + user data
    
    Frontend->>Backend: GET /users/clerk/{clerk_id}
    Backend->>Database: Query users table
    
    alt User exists
        Database->>Backend: Return user data
        Backend->>Frontend: User + role + permissions
    else User not found
        Backend->>Frontend: needs_registration: true
        Frontend->>Backend: POST /users/sync-clerk
        Backend->>Database: INSERT new user
        Database->>Backend: Return new user ID
        Backend->>Frontend: User created with role="beneficiary"
    end
    
    Frontend->>Frontend: Set UserContext
    Frontend->>Frontend: Redirect to role-based dashboard
    Frontend->>User: Show appropriate dashboard
```

## 📊 Credit Score Calculation Flow

```mermaid
sequenceDiagram
    participant Dashboard
    participant API
    participant Backend
    participant Model
    participant SHAP
    participant Database
    
    Dashboard->>API: getBeneficiary(id)
    API->>Backend: GET /beneficiary/{id}
    Backend->>Database: Fetch beneficiary data
    
    alt Has recent score
        Database->>Backend: Return with latest score
    else No recent score
        Database->>Backend: Return beneficiary data
        Backend->>Model: predict_score(features)
        Model->>Model: Load zenith_model.joblib
        Model->>Model: Scale features
        Model->>Model: Predict probability
        Model->>Backend: Return score (300-900)
        
        Backend->>Model: predict_risk_need(features)
        Model->>Backend: Return risk category
        
        Backend->>SHAP: generate_explanation(features)
        SHAP->>SHAP: Calculate SHAP values
        SHAP->>SHAP: Analyze feature impacts
        SHAP->>Backend: Natural language explanation
        
        Backend->>Database: INSERT score_history
        Database->>Backend: Score saved
    end
    
    Backend->>API: Beneficiary + score + explanation
    API->>Dashboard: Display credit profile
```

## 🔄 Online Learning Flow (Model Update)

```mermaid
sequenceDiagram
    participant Dashboard
    participant API
    participant Backend
    participant Model
    participant Filesystem
    participant Database
    
    Dashboard->>API: updateBeneficiary(id, new_data)
    API->>Backend: POST /update
    Backend->>Model: validate_data(new_data)
    
    alt Invalid data
        Model->>Backend: Validation error
        Backend->>API: 400 Bad Request
    else Valid data
        Backend->>Database: UPDATE beneficiaries
        Database->>Backend: Success
        
        Backend->>Model: predict_score(new_data)
        Model->>Backend: New score
        
        Backend->>Database: INSERT score_history
        
        Backend->>Model: update_model(new_data)
        Note over Model: Online Learning via partial_fit()
        Model->>Model: Partial fit with new data
        Model->>Filesystem: Save updated model.joblib
        Model->>Backend: Model updated
        
        Backend->>API: Success + new score
        API->>Dashboard: Display updated profile
    end
```

## 🎯 Score Simulation Flow (What-If Feature)

```mermaid
sequenceDiagram
    participant User
    participant Simulator
    participant API
    participant Backend
    participant Model
    participant Explainer
    
    User->>Simulator: Open Score Simulator
    Simulator->>Simulator: Load current data
    User->>Simulator: Adjust hypothetical values
    User->>Simulator: Click "Simulate"
    
    Simulator->>API: simulateScore(current_data, changes)
    API->>Backend: POST /simulate
    
    Backend->>Model: predict_score(current_data)
    Model->>Backend: current_score
    
    Backend->>Backend: Merge current + hypothetical
    Backend->>Model: predict_score(projected_data)
    Model->>Backend: projected_score
    
    Backend->>Explainer: generate_explanation(projected_data)
    Explainer->>Backend: Explanation + recommendations
    
    Backend->>Backend: Calculate score_change
    Backend->>API: Simulation results
    API->>Simulator: Display projection
    
    Simulator->>User: Show current vs projected
    Note over Simulator: No database changes<br/>No model update
```

## 🔐 Role-Based Access Control

```mermaid
graph LR
    subgraph "User Roles"
        Admin[Admin<br/>Full Access]
        Officer[Loan Officer<br/>Assessment & Processing]
        Beneficiary[Beneficiary<br/>Self Service]
        Manager[Bank Manager<br/>Analytics & Reports]
        Auditor[Auditor<br/>Compliance & Logs]
    end
    
    subgraph "Permissions & Routes"
        ManageUsers[Manage Users]
        ManageSystem[Manage System Settings]
        ViewAll[View All Beneficiaries]
        ProcessLoans[Process Loan Applications]
        ViewAnalytics[View Analytics]
        ViewOwn[View Own Profile Only]
        ApplyLoans[Apply for Loans]
        ViewReports[View Compliance Reports]
        ViewAudit[View Audit Logs]
    end
    
    Admin --> ManageUsers
    Admin --> ManageSystem
    Admin --> ViewAll
    Admin --> ProcessLoans
    Admin --> ViewAnalytics
    Admin --> ViewAudit
    
    Officer --> ViewAll
    Officer --> ProcessLoans
    Officer --> ViewAnalytics
    
    Beneficiary --> ViewOwn
    Beneficiary --> ApplyLoans
    
    Manager --> ViewAll
    Manager --> ViewAnalytics
    Manager --> ViewReports
    
    Auditor --> ViewAudit
    Auditor --> ViewReports
    
    style Admin fill:#f44336
    style Officer fill:#2196f3
    style Beneficiary fill:#4caf50
    style Manager fill:#ff9800
    style Auditor fill:#9c27b0
```

## 🚀 Development Workflow

```mermaid
graph TB
    Start([Developer Setup])
    Start --> CheckEnv{.env.local<br/>exists?}
    
    CheckEnv -->|No| CreateEnv[Create .env.local<br/>Add SUPABASE_* keys]
    CheckEnv -->|Yes| RunSetup
    
    CreateEnv --> RunSetup[Run setup.bat]
    
    RunSetup --> BackendSetup[Backend Setup]
    RunSetup --> FrontendSetup[Frontend Setup]
    
    BackendSetup --> CreateVenv[Create venv]
    CreateVenv --> InstallDeps[pip install -r requirements.txt]
    InstallDeps --> GenData[python data_generator.py]
    GenData --> TrainModel[python model.py]
    TrainModel --> StartBackend[python main.py]
    
    FrontendSetup --> NpmInstall[npm install]
    NpmInstall --> StartFrontend[npm start]
    
    StartBackend --> Backend([Backend Running<br/>localhost:8000])
    StartFrontend --> Frontend([Frontend Running<br/>localhost:3000])
    
    Backend --> Test[Test Application]
    Frontend --> Test
    
    Test --> CreateUsers[Run setup_admin.py<br/>Create test users/roles]
    CreateUsers --> Dev([Development Ready])
    
    style Start fill:#4caf50
    style Backend fill:#2196f3
    style Frontend fill:#ff9800
    style Dev fill:#4caf50
```

## 📡 API Endpoint Map

```mermaid
graph LR
    subgraph "Public Endpoints"
        Root[GET /<br/>API Info]
        Health[GET /health<br/>System Status]
    end
    
    subgraph "User Management"
        SyncClerk[POST /users/sync-clerk<br/>Create/Sync User]
        GetUserClerk[GET /users/clerk/:id<br/>Get by Clerk ID]
        UpdateRole[PUT /users/:id/role<br/>Update Role]
        GetUser[GET /users/:id<br/>Get User]
    end
    
    subgraph "Beneficiary Operations"
        GetAll[GET /beneficiaries<br/>List All]
        GetOne[GET /beneficiary/:id<br/>Get Profile + Score]
        Update[POST /update<br/>Update + Retrain]
        CreateDemo[POST /create-demo-beneficiary<br/>Create Test User]
    end
    
    subgraph "ML & Scoring"
        Simulate[POST /simulate<br/>What-If Projection]
        Features[GET /feature-importance<br/>Model Insights]
        History[GET /score-history/:id<br/>Score Timeline]
    end
    
    Root -.->|Info| Health
    GetUserClerk -->|Auth| GetAll
    GetAll -->|Select| GetOne
    GetOne -->|Update| Update
    Update -->|Retrains| Features
    GetOne -->|Simulate| Simulate
    GetOne -->|History| History
    
    style Root fill:#e1f5ff
    style Health fill:#4caf50
    style Simulate fill:#ff9800
    style Update fill:#f44336
```

## 🗄️ Database Schema Relations

```mermaid
erDiagram
    TENANTS ||--o{ USERS : contains
    USERS ||--o{ BENEFICIARIES : has
    BENEFICIARIES ||--o{ SCORE_HISTORY : tracks
    USERS ||--o{ SCORE_HISTORY : calculates
    
    TENANTS {
        uuid id PK
        string name
        jsonb settings
        timestamp created_at
    }
    
    USERS {
        uuid id PK
        uuid tenant_id FK
        string clerk_user_id
        string email
        string first_name
        string last_name
        enum role
        jsonb permissions
        boolean is_active
        timestamp last_login
    }
    
    BENEFICIARIES {
        uuid id PK
        uuid user_id FK
        string beneficiary_code
        date date_of_birth
        integer age
        decimal monthly_income
        enum employment_type
        integer loan_repayment_status
        integer electricity_bill_paid_on_time
        integer mobile_recharge_frequency
        boolean is_high_need
        enum kyc_status
    }
    
    SCORE_HISTORY {
        uuid id PK
        uuid beneficiary_id FK
        integer credit_score
        string risk_category
        decimal confidence_level
        string model_version
        jsonb feature_values
        jsonb feature_impacts
        text explanation
        jsonb improvement_suggestions
        string calculation_trigger
        uuid calculated_by FK
        timestamp calculated_at
    }
```

## 🎯 Key Features Flow

```mermaid
mindmap
    root((Project Zenith<br/>Credit Scoring))
        Dynamic Scoring
            SGDClassifier
            Online Learning
            Real-time Updates
            300-900 Scale
        Explainable AI
            SHAP Values
            Natural Language
            Feature Impacts
            Recommendations
        Multi-User System
            Clerk Auth
            Role-Based Access
            5 User Roles
            Permissions Matrix
        What-If Simulator
            Hypothetical Changes
            Score Projections
            Impact Analysis
            No DB Changes
        Risk Matrix
            Risk Level
            Financial Need
            2x2 Classification
            Instant Approval Eligible
        Score History
            Timeline Tracking
            Model Versioning
            Audit Trail
            Confidence Levels
```

## 🔧 Technology Stack

```mermaid
graph TB
    subgraph "Frontend Stack"
        React[React 18.2<br/>UI Framework]
        MUI[Material-UI 5.14<br/>Component Library]
        Clerk[Clerk 5.51<br/>Authentication]
        Axios[Axios 1.6<br/>HTTP Client]
        Recharts[Recharts 2.8<br/>Data Visualization]
        ReactRouter[React Router 7.9<br/>Navigation]
    end
    
    subgraph "Backend Stack"
        FastAPI[FastAPI 0.x<br/>Web Framework]
        Uvicorn[Uvicorn<br/>ASGI Server]
        Asyncpg[Asyncpg<br/>PostgreSQL Driver]
        Sklearn[Scikit-learn<br/>ML Library]
        SHAP[SHAP<br/>Explainability]
        Pandas[Pandas<br/>Data Processing]
    end
    
    subgraph "Infrastructure"
        Supabase[Supabase<br/>PostgreSQL + Auth]
        Clerk2[Clerk<br/>User Management]
        Node[Node.js 16+<br/>Runtime]
        Python[Python 3.8+<br/>Runtime]
    end
    
    React --> MUI
    React --> Clerk
    React --> Axios
    React --> Recharts
    React --> ReactRouter
    
    FastAPI --> Uvicorn
    FastAPI --> Asyncpg
    FastAPI --> Sklearn
    FastAPI --> SHAP
    FastAPI --> Pandas
    
    Axios -.->|HTTP| FastAPI
    Asyncpg -.->|Connection| Supabase
    Clerk -.->|Sync| Clerk2
    
    style React fill:#61dafb
    style FastAPI fill:#009688
    style Supabase fill:#3fcf8e
    style Sklearn fill:#f7931e
    style SHAP fill:#9c27b0
```

---

## 📝 Quick Reference Commands

### Setup
```bash
# One-time setup (Windows)
setup.bat

# Manual backend setup
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python data_generator.py
python model.py
python main.py

# Manual frontend setup
cd frontend
npm install
npm start
```

### Start Servers
```bash
# Start both servers (Windows)
start-servers.bat
# or
start-both-servers.bat

# Manual start
cd backend && venv\Scripts\activate && python main.py
cd frontend && npm start
```

### Testing & Admin
```bash
# Create admin/test users
python setup_admin.py

# Test API health
curl http://localhost:8000/health

# Test beneficiaries endpoint
curl http://localhost:8000/beneficiaries
```

### Deployment
```bash
# Backend production
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker

# Frontend production
npm run build
serve -s build
```

---

## 🎓 Learning Path for New Developers

1. **Start Here**: Read `README.md` and `HOW_TO_RUN.md`
2. **Setup**: Run `setup.bat` and verify both servers start
3. **Explore API**: Visit http://localhost:8000 and http://localhost:8000/health
4. **Test Frontend**: Sign up at http://localhost:3000
5. **Create Roles**: Run `python setup_admin.py` to create test users
6. **Study Code**:
   - Backend: `main.py` → `model.py` → `explainer.py` → `database.py`
   - Frontend: `App.js` → `api/api.js` → `contexts/UserContext.js` → role dashboards
7. **Test Features**: Try score simulation, beneficiary updates, role switching

---

*Generated: October 15, 2025*  
*Project: Zenith - Dynamic Credit Scoring & Guidance System*
