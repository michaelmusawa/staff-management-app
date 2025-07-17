//src-tauri/src/commands.rs

#[tauri::command]
pub fn my_custom_command() -> String {
    "Hello from Rust!".into()
}

#[tauri::command]
pub fn save_user(name: String, email: String) -> Result<(), String> {
    // TODO: wire this up to your preferred DB (e.g. sqlite via rusqlite, or any other)
    // Example placeholder logic:
    println!("Saving user: {} <{}>", name, email);

    // If you encounter an error, return Err("some message".into());
    Ok(())
}
