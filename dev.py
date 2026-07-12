import argparse
import subprocess
import os
import sys
import threading
import time

def stream_output(process, prefix):
    """Reads lines from a subprocess and prefixes them."""
    for line in iter(process.stdout.readline, b''):
        try:
            decoded = line.decode('utf-8', errors='replace').rstrip()
            if decoded:
                print(f"[{prefix}] {decoded}")
        except:
            pass

def start_dev(start_backend=True, start_frontend=True):
    """Starts the development servers concurrently."""
    processes = []
    
    if start_backend:
        print("[INFO] Starting Backend Server (Flask)...")
        be_process = subprocess.Popen(
            [sys.executable, "app.py"],
            cwd="backend",
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT
        )
        be_thread = threading.Thread(target=stream_output, args=(be_process, "BACKEND"))
        be_thread.daemon = True
        be_thread.start()
        processes.append(("BACKEND", be_process))
        
    if start_frontend:
        print("[INFO] Starting Frontend Server (Vite)...")
        fe_process = subprocess.Popen(
            "npm run dev",
            cwd="frontend",
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT
        )
        fe_thread = threading.Thread(target=stream_output, args=(fe_process, "FRONTEND"))
        fe_thread.daemon = True
        fe_thread.start()
        processes.append(("FRONTEND", fe_process))
        
    try:
        while True:
            # Poll processes to keep main thread alive
            # and allow KeyboardInterrupt to be caught
            all_dead = True
            for name, p in processes:
                if p.poll() is None:
                    all_dead = False
            
            if all_dead:
                break
            time.sleep(0.5)
            
    except KeyboardInterrupt:
        print("\n[INFO] Shutting down servers...")
        for name, p in processes:
            p.terminate()
        print("[INFO] All servers stopped cleanly.")

def run_script(script_name, cwd="backend"):
    """Runs a specific Python script in the backend directory."""
    print(f"[INFO] Executing {script_name}...")
    subprocess.run([sys.executable, script_name], cwd=cwd)
    print(f"[INFO] Finished {script_name}")

def install_deps():
    """Installs pip and npm dependencies."""
    print("[INFO] Installing Backend Dependencies (pip)...")
    subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], cwd="backend")
    
    print("\n[INFO] Installing Frontend Dependencies (npm)...")
    subprocess.run("npm install", cwd="frontend", shell=True)
    
    print("\n[INFO] All dependencies installed successfully!")

def main():
    parser = argparse.ArgumentParser(description="OGS Development Manager CLI")
    subparsers = parser.add_subparsers(dest="command", help="Available commands")
    
    # Server Commands
    subparsers.add_parser("start", help="Start both frontend and backend servers")
    subparsers.add_parser("start-backend", help="Start only backend")
    subparsers.add_parser("start-frontend", help="Start only frontend")
    
    # Dependencies
    subparsers.add_parser("install", help="Install all dependencies (npm and pip)")
    
    # Database Commands
    db_parser = subparsers.add_parser("db", help="Database management scripts")
    db_subparsers = db_parser.add_subparsers(dest="db_command")
    
    db_subparsers.add_parser("seed", help="Run populate_from_assets.py")
    db_subparsers.add_parser("seed-gallery", help="Run seed_gallery.py")
    db_subparsers.add_parser("check", help="Run check_instance_db.py")
    db_subparsers.add_parser("users", help="Run check_users.py")
    db_subparsers.add_parser("admin", help="Run create_admin.py")
    db_subparsers.add_parser("shell", help="Open an interactive database shell")

    args = parser.parse_args()
    
    # Routing
    if args.command == "start":
        start_dev(start_backend=True, start_frontend=True)
    elif args.command == "start-backend":
        start_dev(start_backend=True, start_frontend=False)
    elif args.command == "start-frontend":
        start_dev(start_backend=False, start_frontend=True)
    elif args.command == "install":
        install_deps()
    elif args.command == "db":
        if args.db_command == "seed":
            run_script("populate_from_assets.py")
        elif args.db_command == "seed-gallery":
            run_script("seed_gallery.py")
        elif args.db_command == "check":
            run_script("check_instance_db.py")
        elif args.db_command == "users":
            run_script("check_users.py")
        elif args.db_command == "admin":
            run_script("create_admin.py")
        elif args.db_command == "shell":
            # Wait for user input interactively by calling subprocess without pipe
            print("[INFO] Entering Interactive Shell...")
            subprocess.run([sys.executable, "shell.py"], cwd="backend")
        else:
            db_parser.print_help()
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
