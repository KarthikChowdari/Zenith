# Project Uday - Dynamic Credit Scoring & Guidance System

**Project Uday** is a revolutionary AI-powered credit scoring system that provides dynamic, real-time credit assessments and personalized financial guidance for underserved populations.

## 🌟 Key Innovations

### 1. Dynamic Scoring Engine
- Uses **SGDClassifier** with online learning capabilities
- Updates scores in near real-time as new data becomes available
- Continuously improves model accuracy through incremental learning

### 2. "Uday Score Simulator" - The Killer Feature ⭐
- Interactive "What-If" tool showing how future positive actions improve scores
- Real-time score projections based on hypothetical improvements
- Visual journey mapping from current to projected scores
- Actionable recommendations with impact assessment

### 3. Natural Language Explanations
- SHAP-powered explainable AI
- Converts complex model outputs into simple, human-readable sentences
- Provides specific guidance for improvement
- Perfect for loan officers and beneficiaries

### 4. Risk-Need Matrix
- 2x2 classification system: Risk Level × Financial Need
- **"Low Risk - High Need"** beneficiaries get instant loan approval
- Visual matrix highlighting beneficiary categories

## 🛠️ Technology Stack

### Backend
- **FastAPI** - High-performance Python web framework
- **Scikit-learn** - Machine learning with SGDClassifier
- **SHAP** - Explainable AI and feature importance
- **Pandas** - Data manipulation and analysis
- **Joblib** - Model persistence and loading

### Frontend
- **React.js** - Modern UI framework
- **Material-UI (MUI)** - Professional component library
- **Recharts** - Interactive data visualizations
- **Axios** - API communication

### Key Features
- **Online Learning** - Model updates with new data points
- **Real-time Scoring** - Instant credit score calculation
- **Interactive Simulation** - What-if scenario planning
- **Responsive Design** - Works on all device sizes
- **Professional UI** - Clean, intuitive interface

## 📁 Project Structure

```
sih-2/
├── backend/
│   ├── main.py              # FastAPI application with all endpoints
│   ├── model.py             # ML model with online learning
│   ├── explainer.py         # SHAP-based XAI explanations
│   ├── data_generator.py    # Realistic data generation
│   ├── requirements.txt     # Python dependencies
│   └── beneficiaries.csv    # Generated training data
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ScoreGauge.js      # Credit score visualization
│   │   │   ├── RiskMatrix.js      # Risk-need assessment matrix
│   │   │   ├── BeneficiaryProfile.js  # Detailed profile display
│   │   │   └── ScoreSimulator.js  # Interactive what-if tool
│   │   ├── pages/
│   │   │   └── DashboardPage.js   # Main dashboard layout
│   │   ├── api/
│   │   │   └── api.js             # API communication layer
│   │   ├── App.js             # Main React application
│   │   ├── index.js           # React entry point
│   │   └── index.css          # Global styles
│   ├── public/
│   │   ├── index.html         # HTML template
│   │   └── manifest.json      # PWA manifest
│   └── package.json           # Node.js dependencies
└── README.md                  # This file
```

## 🚀 Setup Instructions

### Prerequisites
- Python 3.8+ installed
- Node.js 16+ installed
- Git installed

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment:**
   ```bash
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Generate data and train model:**
   ```bash
   python data_generator.py
   python model.py
   ```

6. **Start the API server:**
   ```bash
   python main.py
   ```
   
   Server will run at: `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the React development server:**
   ```bash
   npm start
   ```
   
   Application will open at: `http://localhost:3000`

## 📊 API Endpoints

### Core Endpoints

- **GET `/beneficiary/{id}`** - Get beneficiary profile with AI analysis
- **POST `/simulate`** - Simulate score changes (killer feature!)
- **POST `/update`** - Update model with new data (online learning)
- **GET `/beneficiaries`** - List all beneficiaries
- **GET `/feature-importance`** - Get model feature importance
- **GET `/health`** - API health status

### Example API Usage

```python
# Get beneficiary data
response = requests.get("http://localhost:8000/beneficiary/1")

# Simulate score improvement
simulation_data = {
    "current_data": {
        "loan_repayment_status": 0,
        "electricity_bill_paid_on_time": 0,
        "mobile_recharge_frequency": 2
    },
    "hypothetical_changes": {
        "loan_repayment_status": 1,
        "electricity_bill_paid_on_time": 1
    }
}
response = requests.post("http://localhost:8000/simulate", json=simulation_data)
```

## 🎯 Key Features Demonstration

### 1. Dynamic Credit Scoring
- Real-time score calculation (300-900 scale)
- Multiple factor analysis
- Automated risk categorization

### 2. Interactive Score Simulator
- **What-if scenario planning**
- Visual score journey mapping
- Instant impact assessment
- Actionable improvement suggestions

### 3. Explainable AI
- Natural language explanations
- SHAP-powered feature importance
- Specific improvement recommendations
- Transparent decision making

### 4. Insta-Loan Feature
- Automatic approval for "Low Risk - High Need" beneficiaries
- Real-time eligibility assessment
- One-click loan approval interface

## 🎨 User Interface Highlights

### Dashboard Features
- **Two-column layout** for optimal information display
- **Interactive components** with real-time updates
- **Professional Material-UI design**
- **Responsive** for all screen sizes
- **Intuitive navigation** with beneficiary selector

### Visual Components
- **Score Gauge** - Animated credit score display
- **Risk Matrix** - Interactive 2x2 grid
- **Profile Cards** - Comprehensive beneficiary information
- **Simulation Charts** - Score journey visualization

## 🏅 What Makes This Award-Winning

### Technical Excellence
- **Online Learning** - Model improves continuously
- **Real-time Processing** - Instant score updates
- **Scalable Architecture** - FastAPI + React.js
- **Production Ready** - Error handling, logging, validation

### Innovation
- **Score Simulator** - Unique "what-if" capability
- **Natural Language AI** - Complex model explanations made simple
- **Dynamic Learning** - Adapts to new data automatically
- **Social Impact** - Designed for financial inclusion

### User Experience
- **Intuitive Interface** - Easy for loan officers to use
- **Visual Guidance** - Clear charts and indicators
- **Actionable Insights** - Specific improvement recommendations
- **Professional Design** - Polished, modern UI

## 🔄 Model Training & Updates

The system includes sophisticated ML capabilities:

1. **Initial Training** - SGDClassifier trained on generated dataset
2. **Online Learning** - Model updates with new data points via `partial_fit()`
3. **Feature Importance** - Real-time SHAP analysis
4. **Model Persistence** - Automatic saving and loading

## 🎯 Business Impact

### For Financial Institutions
- Automated credit assessment
- Reduced processing time
- Better risk management
- Increased loan approval efficiency

### For Beneficiaries
- Clear improvement pathways
- Fair, transparent scoring
- Educational financial guidance
- Access to financial services

### For Society
- Financial inclusion for underserved populations
- Data-driven decision making
- Reduced bias in lending
- Economic empowerment

## 🚀 Future Enhancements

- **Mobile App** - React Native implementation
- **Advanced Analytics** - Deeper insights and reporting
- **Integration APIs** - Connect with banking systems
- **Multi-language Support** - Regional language interfaces
- **Advanced ML Models** - Gradient boosting, neural networks

## 👥 Development Team

**Project Uday** - Built for social impact and financial inclusion

---

**🏆 This is not just a credit scoring system - it's a complete financial empowerment platform designed to change lives!**