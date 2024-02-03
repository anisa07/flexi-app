// models/component.go

package models

type Component struct {
	ID   uint   `json:"id" gorm:"primary_key"`
	Type string `json:"type"`
	SelectedComponentID uint
	Label string `json:"label"`
	FormComponentName  string `json:"formComponentName"`
	Placeholder string `json:"placeholder"`
	Format string `json:"format"`
	Validation []Validation `json:"validation" gorm:"foreignKey:ComponentID"`
	SelectOptions []SelectOptions `json:"selectedOptions" gorm:"foreignKey:ComponentID"`
	RadioGroupOptions []RadioGroupOptions `json:"radioGroupOtions" gorm:"foreignKey:ComponentID"`
	SubComponents []Component `json:"subComponents" gorm:"foreignKey:ComponentID"`
	ComponentID uint
} 

type Validation struct {
	ID   uint   `json:"id" gorm:"primary_key"`
	RuleName string `json:"ruleName"`
	WithParam bool `json:"withParam"`
	Param string `json:"param"` 
	ComponentID uint
}

type SelectOptions struct {
	ID   uint   `json:"id" gorm:"primary_key"`
	Label string `json:"label"`
	Value string `json:"value"`
	ComponentID uint
}

type RadioGroupOptions struct {
	ID   uint   `json:"id" gorm:"primary_key"`
	Label string `json:"label"`
	Value string `json:"value"`
	ComponentID uint
}

type SelectedComponent struct {
	ID   uint   `json:"id" gorm:"primary_key"`
	Name string `json:"name"`
	Component Component `json:"component" gorm:"foreignKey:SelectedComponentID"`
}
