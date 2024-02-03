// models/component.go

package models

type ComponentInput struct {
	// ID   uint   `json:"id" gorm:"primary_key"`
	ID   uint   `json:"id"`
	Type string `json:"type" binding:"required"`
	// SelectedComponentID uint
	Label string `json:"label" binding:"required"`
	FormComponentName  string `json:"formComponentName" binding:"required"`
	Placeholder string `json:"placeholder" binding:"required"`
	Format string `json:"format"`
	Validation []ValidationInput `json:"validation" binding:"required"` 
	SelectOptions []SelectOptionsInput `json:"selectedOptions" binding:"required"`
	RadioGroupOptions []RadioGroupOptionsInput `json:"radioGroupOtions" binding:"required"`
	SubComponents []ComponentInput `json:"subComponents" binding:"required"`
	// ComponentID uint
} 

type ValidationInput struct {
	ID   uint   `json:"id"`
	RuleName string `json:"ruleName" binding:"required"`
	WithParam bool `json:"withParam" binding:"required"`
	Param string `json:"param" binding:"required"` 
	// ComponentID uint
}

type SelectOptionsInput struct {
	ID   uint   `json:"id"`
	Label string `json:"label" binding:"required"`
	Value string `json:"value" binding:"required"`
	// ComponentID uint
}

type RadioGroupOptionsInput struct {
	ID   uint   `json:"id"`
	Label string `json:"label" binding:"required"`
	Value string `json:"value" binding:"required"`
	// ComponentID uint
}

type SelectedComponentInput struct {
	ID   uint   `json:"id"`
	Name string `json:"name" binding:"required"`
	Component ComponentInput `json:"component" binding:"required"`
	// Component Component `gorm:"foreignKey:SelectedComponentID"`
}
