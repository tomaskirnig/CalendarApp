# Nastavení Backendu

Po stažení Backendu proveďte následující kroky ve složce `Backend`:

1.  **Vytvoření virtuálního prostředí:**

    ```bash
    py -m venv venv
    ```

2.  **Aktivace virtuálního prostředí:**

    ```bash
    .\venv\Scripts\activate
    ```

3.  **Doinstalování závislostí:**

    ```bash
    pip install -r .\requirements.txt
    ```

4.  **Vytvoření tabulek a databáze:**

    ```bash
    py manage.py makemigrations
    py manage.py migrate
    ```

5.  **Spuštění vývojového lokálního serveru:**

    ```bash
    py manage.py runserver
    ```

# Nastavení Frontendu

Po stažení Frontendu proveďte následující kroky ve složce `Frontend`:

1.  **Doinstalování závislostí:**

    ```bash
    npm i
    ```

2.  **Spuštění vývojového lokálního serveru:**

    ```bash
    npm run start
    ```

---

# Systém pro správu událostí

## 1. Úvod
Firma potřebuje desktopovou aplikaci pro správu a plánování firemních akcí, jako jsou školení, porady, team-buildingy a další interní události. Systém umožní administrátorům vytvářet a spravovat události a zaměstnancům se na ně přihlašovat.

## 2. Funkční požadavky

### Správa uživatelů
- **Přihlášení do systému**
- **Role uživatelů**:
  - Administrátor
  - Zaměstnanec

### Správa událostí
- **Vytvoření nové události**  
  - Název  
  - Popis  
  - Datum  
  - Čas  
  - Místo  
  - Organizátor  
  - Kapacita  
- **Možnost opakování události**  
  - Denní  
  - Týdenní  
  - Měsíční  
- **Editace a mazání existujících událostí**
- **Přehled kalendáře s událostmi**

### Správa účasti
- **Možnost přihlášení zaměstnanců na událost**
- **Omezení kapacity**
- **Možnost odhlášení z události**
- **Přidání zaměstnance administrátorem** (např. povinná účast)

### Správa místností
- **Rezervace místností pro konkrétní události**
- **Přehled obsazenosti místností**
# CalendarApp
