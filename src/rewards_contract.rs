#![no_std]
use soroban_sdk::{contractimpl, contracttype, Address, Env, Map, String, Symbol, Vec};

mod token_interface {
    soroban_sdk::contractimport!(file = "soroban_token_spec.wasm");
}

pub struct RewardsContract;

#[derive(Clone)]
#[contracttype]
pub struct Task {
    pub creator: Address,
    pub description: String,
    pub reward: i128,
    pub is_active: bool,
}

#[contracttype]
pub enum DataKey {
    Tasks,
    Stakes(Address),
    Completions((Address, u32)), // (user, task_id)
}

#[contractimpl]
impl RewardsContract {
    pub fn init(env: Env) {
        let tasks: Vec<Task> = Vec::new(&env);
        env.storage().set(&DataKey::Tasks, &tasks);
    }

    pub fn stake(env: Env, user: Address, amount: i128) {
        user.require_auth();

        let mut current = env
            .storage()
            .get::<_, i128>(&DataKey::Stakes(user.clone()))
            .unwrap_or(0);
        current += amount;

        // Transfer token from user to contract
        let client = token_interface::Client::new(&env, &env.current_contract_address());
        client.transfer_from(&user, &env.current_contract_address(), &amount);

        env.storage().set(&DataKey::Stakes(user), &current);
    }

    pub fn create_task(env: Env, creator: Address, description: String, reward: i128) {
        creator.require_auth();

        let mut tasks: Vec<Task> = env.storage().get(&DataKey::Tasks).unwrap_or(Vec::new(&env));

        let task = Task {
            creator,
            description,
            reward,
            is_active: true,
        };

        tasks.push_back(task);
        env.storage().set(&DataKey::Tasks, &tasks);
    }

    pub fn complete_task(env: Env, user: Address, task_id: u32) {
        user.require_auth();

        let mut tasks: Vec<Task> = env.storage().get(&DataKey::Tasks).unwrap();

        if task_id as usize >= tasks.len() {
            panic!("Invalid task ID");
        }

        let mut task = tasks.get(task_id).unwrap();

        if !task.is_active {
            panic!("Task is not active");
        }

        // Check if already completed
        let key = DataKey::Completions((user.clone(), task_id));
        if env.storage().has(&key) {
            panic!("Already completed");
        }

        // Reward user
        let token = token_interface::Client::new(&env, &env.current_contract_address());
        token.transfer(&user, &task.reward);

        env.storage().set(&key, &true);
    }

    pub fn get_tasks(env: Env) -> Vec<Task> {
        env.storage().get(&DataKey::Tasks).unwrap_or(Vec::new(&env))
    }

    pub fn get_stake(env: Env, user: Address) -> i128 {
        env.storage().get(&DataKey::Stakes(user)).unwrap_or(0)
    }
}
