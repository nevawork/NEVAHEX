-- Example Roblox Luau script for NEVAHEX demonstration
-- This script demonstrates various Luau features that NEVAHEX can protect

local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local TweenService = game:GetService("TweenService")
local UserInputService = game:GetService("UserInputService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local TweenInfo = TweenInfo
local Vector3 = Vector3
local Color3 = Color3

-- Type annotations for better IDE support
type PlayerData = {
	name: string,
	level: number,
	xp: number,
	inventory: {string},
}

type WeaponConfig = {
	name: string,
	damage: number,
	fireRate: number,
	range: number,
}

-- Module pattern for clean code organization
local PlayerManager = {}
PlayerManager.__index = PlayerManager

function PlayerManager.new(player: Player): PlayerData
	local self = setmetatable({}, PlayerManager)
	self.player = player
	self.data = {
		name = player.Name,
		level = 1,
		xp = 0,
		inventory = {"Starter Sword", "Health Potion"},
	} :: PlayerData
	return self
end

function PlayerManager:addXP(amount: number)
	self.data.xp += amount
	local xpNeeded = self.data.level * 100
	if self.data.xp >= xpNeeded then
		self.data.level += 1
		self.data.xp -= xpNeeded
		print(`{self.data.name} leveled up to level {self.data.level}!`)
	end
end

function PlayerManager:getData(): PlayerData
	return self.data
end

-- Weapon system with configuration
local Weapons = {
	["Starter Sword"] = {
		name = "Starter Sword",
		damage = 10,
		fireRate = 1.0,
		range = 10,
	} :: WeaponConfig,
	["Iron Sword"] = {
		name = "Iron Sword",
		damage = 25,
		fireRate = 1.2,
		range = 12,
	} :: WeaponConfig,
	["Diamond Blade"] = {
		name = "Diamond Blade",
		damage = 50,
		fireRate = 1.5,
		range = 15,
	} :: WeaponConfig,
}

-- Combat system
local CombatSystem = {}
CombatSystem.__index = CombatSystem

function CombatSystem.new(weaponName: string)
	local self = setmetatable({}, CombatSystem)
	self.weapon = Weapons[weaponName] or Weapons["Starter Sword"]
	self.lastAttack = 0
	return self
end

function CombatSystem:canAttack(): boolean
	return tick() - self.lastAttack >= self.weapon.fireRate
end

function CombatSystem:attack(target: Model): boolean
	if not self:canAttack() then return false end
	
	local humanoid = target:FindFirstChild("Humanoid")
	if not humanoid then return false end
	
	local distance = (target.PrimaryPart.Position - workspace.CurrentCamera.CFrame.Position).Magnitude
	if distance > self.weapon.range then return false end
	
	humanoid:TakeDamage(self.weapon.damage)
	self.lastAttack = tick()
	
	-- Visual feedback
	local hitEffect = Instance.new("Part")
	hitEffect.Size = Vector3.new(1, 1, 1)
	hitEffect.Position = target.PrimaryPart.Position
	hitEffect.Anchored = true
	hitEffect.CanCollide = false
	hitEffect.Material = Enum.Material.Neon
	hitEffect.Color = Color3.new(1, 0, 0)
	hitEffect.Parent = workspace
	
	task.delay(0.5, function()
		hitEffect:Destroy()
	end)
	
	return true
end

-- Event system for communication
local Events = {}
Events.__index = Events

function Events.new()
	local self = setmetatable({}, Events)
	self.listeners = {} :: {[string]: {Function}}
	return self
end

function Events:on(event: string, callback: () -> ())
	if not self.listeners[event] then
		self.listeners[event] = {}
	end
	table.insert(self.listeners[event], callback)
end

function Events:fire(event: string, ...)
	if self.listeners[event] then
		for _, callback in ipairs(self.listeners[event]) do
			task.spawn(callback, ...)
		end
	end
end

-- UI Animation helper
local UIAnimations = {}

function UIAnimations.tween(guiObject: GuiObject, properties: {[string]: any}, duration: number, easingStyle: Enum.EasingStyle?, easingDirection: Enum.EasingDirection?): Tween
	local tweenInfo = TweenInfo.new(duration, easingStyle or Enum.EasingStyle.Quad, easingDirection or Enum.EasingDirection.Out)
	local tween = TweenService:Create(guiObject, tweenInfo, properties)
	tween:Play()
	return tween
end

function UIAnimations.fadeIn(guiObject: GuiObject, duration: number?): Tween
	return UIAnimations.tween(guiObject, {BackgroundTransparency = 0, TextTransparency = 0}, duration or 0.3)
end

function UIAnimations.fadeOut(guiObject: GuiObject, duration: number?): Tween
	return UIAnimations.tween(guiObject, {BackgroundTransparency = 1, TextTransparency = 1}, duration or 0.3)
end

-- Data persistence helper
local DataStore = {}

function DataStore.save(key: string, data: any): boolean
	local success, result = pcall(function()
		-- In real implementation, use DataStoreService
		local dataStore = game:GetService("DataStoreService"):GetDataStore("PlayerData")
		dataStore:SetAsync(key, data)
	end)
	if not success then
		warn("Failed to save data:", result)
		return false
	end
	return true
end

function DataStore.load(key: string): any?
	local success, result = pcall(function()
		local dataStore = game:GetService("DataStoreService"):GetDataStore("PlayerData")
		return dataStore:GetAsync(key)
	end)
	if not success then
		warn("Failed to load data:", result)
		return nil
	end
	return result
end

-- Main initialization
local function initialize()
	print("[NEVAHEX Example] Initializing Roblox Luau example...")
	
	-- Create player manager for local player
	local localPlayer = Players.LocalPlayer
	if localPlayer then
		local playerManager = PlayerManager.new(localPlayer)
		playerManager:addXP(50)
		print(`Player data: {playerManager:getData().name}, Level: {playerManager:getData().level}`)
	end
	
	-- Initialize combat system
	local combat = CombatSystem.new("Iron Sword")
	print(`Combat initialized with {combat.weapon.name} (Damage: {combat.weapon.damage})`)
	
	-- Set up event system
	local events = Events.new()
	events:on("playerLevelUp", function(playerData)
		print(`Event: {playerData.name} reached level {playerData.level}!`)
	end)
	
	-- Set up UI animations
	local screenGui = Instance.new("ScreenGui")
	screenGui.Name = "NEVAHEXExampleUI"
	screenGui.Parent = localPlayer:WaitForChild("PlayerGui")
	
	local frame = Instance.new("Frame")
	frame.Size = UDim2.new(0, 300, 0, 200)
	frame.Position = UDim2.new(0.5, -150, 0.5, -100)
	frame.BackgroundColor3 = Color3.new(0.1, 0.1, 0.1)
	frame.BackgroundTransparency = 1
	frame.Parent = screenGui
	
	local title = Instance.new("TextLabel")
	title.Size = UDim2.new(1, 0, 0, 50)
	title.Text = "NEVAHEX Protected Script"
	title.TextColor3 = Color3.new(1, 1, 1)
	title.BackgroundTransparency = 1
	title.TextSize = 24
	title.Font = Enum.Font.GothamBold
	title.Parent = frame
	
	UIAnimations.fadeIn(frame, 0.5)
	
	-- Example of executor API usage (will use fallbacks if not available)
	if hookfunction then
		print("Executor detected: hookfunction available")
	end
	
	if Drawing then
		print("Drawing library available")
	end
	
	if identifyexecutor then
		print(`Executor: {identifyexecutor()}`)
	end
	
	-- Continuous loop example
	task.spawn(function()
		while true do
			task.wait(5)
			if localPlayer then
				local data = playerManager and playerManager:getData()
				if data then
					print(`Heartbeat: {data.name} | Level {data.level} | XP {data.xp}`)
				end
			end
		end
	end)
	
	print("[NEVAHEX Example] Initialization complete!")
end

-- Run initialization
initialize()

-- Export modules for external use
return {
	PlayerManager = PlayerManager,
	CombatSystem = CombatSystem,
	Events = Events,
	UIAnimations = UIAnimations,
	DataStore = DataStore,
	Weapons = Weapons,
}