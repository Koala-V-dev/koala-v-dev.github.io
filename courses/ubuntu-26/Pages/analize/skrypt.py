#!/usr/bin/env python3
 
import sys
import os
from pathlib import Path
 
def main():
    print("=== AppArmor Test Script ===")
    print(f"Running as: {os.getlogin()}")
    print(f"UID: {os.getuid()}")
    
    test_locations = [
        str(Path.home() / "Documents/test.txt"),
        str(Path.home() / "private/secret.txt"),
        str(Path.home() / ".ssh/id_rsa"),
        "/etc/passwd",
        "/etc/shadow",
    ]
    
    print("\nTrying to access various locations:")
    for location in test_locations:
        try:
            if os.path.exists(location):
                if os.path.isdir(location):
                    files = os.listdir(location)
                    print(f"✓ Can read {location} ({len(files)} items)")
                else:
                    with open(location, 'r') as f:
                        print(f"✓ Can read {location}")
            else:
                print(f"- {location} doesn't exist")
        except PermissionError:
            print(f"✗ Permission DENIED: {location}")
        except Exception as e:
            print(f"? Error accessing {location}: {type(e).__name__}")
    
    return 0
 
if __name__ == "__main__":
    sys.exit(main())