package main

import (
	"backend/models"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/exp/slices"
	"gorm.io/gorm/clause"
)

func getSelectedComponents(c *gin.Context) {
	var selectedComponents []models.SelectedComponent

	err := models.DB.Preload("Component." + clause.Associations).Preload("Component.SubComponents." + clause.Associations).Find(&selectedComponents).Error 
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	  }
	c.JSON(http.StatusOK, gin.H{"data": selectedComponents})
}

func cascadeDelete(c models.Component) {
	componentValidation := c.Validation
	componentSelectedOptions := c.SelectOptions
	componentRadioGroupOptions := c.RadioGroupOptions
	
	for i := range componentValidation {
		validation := componentValidation[i]
		models.DB.Where("id = ?", validation.ID).Delete(&validation)
    }

	for i := range componentSelectedOptions {
		selectOption := componentSelectedOptions[i]
		models.DB.Where("id = ?", selectOption.ID).Delete(&selectOption)
    }

	for i := range componentRadioGroupOptions {
		radioGroupOtion := componentRadioGroupOptions[i]
		models.DB.Where("id = ?", radioGroupOtion.ID).Delete(&radioGroupOtion)
    }
}

func deleteSelectedComponent(c *gin.Context) {
	var selectedComponent models.SelectedComponent

	if err := models.DB.Where("id = ?", c.Param("id")).Preload("Component." + clause.Associations).Preload("Component.SubComponents." + clause.Associations).First(&selectedComponent).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Component not found!"})
		return
	}

	selectedComponentSubComponents := selectedComponent.Component.SubComponents

	for i := range selectedComponentSubComponents {
		subComponent := selectedComponentSubComponents[i]
		cascadeDelete(subComponent)
		models.DB.Where("id = ?", subComponent.ID).Delete(&subComponent)
	}

	cascadeDelete(selectedComponent.Component)

	models.DB.Where("id = ?", selectedComponent.Component.ID).Delete(&selectedComponent.Component)
	models.DB.Where("id = ?", selectedComponent.ID).Delete(&selectedComponent)
	
	c.JSON(http.StatusOK, gin.H{"data": true})
}

func cascadeCreate(input models.ComponentInput) models.Component {
	validation := []models.Validation{}
	selectOptions := []models.SelectOptions{}
	radioGroupOptions := []models.RadioGroupOptions{}

	for i := range input.Validation {
		input := input.Validation[i]
        validation = append(validation, models.Validation{
			Param: input.Param,
			RuleName: input.RuleName,
			WithParam: input.WithParam,
		})
    }

	for i := range input.SelectOptions {
		input := input.SelectOptions[i]
        selectOptions = append(selectOptions, models.SelectOptions{
			Value: input.Value,
			Label: input.Label,
		})
    }

	for i := range input.RadioGroupOptions {
		input := input.RadioGroupOptions[i]
        radioGroupOptions = append(radioGroupOptions, models.RadioGroupOptions{
			Value: input.Value,
			Label: input.Label,
		})
    }

	component := models.Component{
		FormComponentName: input.FormComponentName,
		Type: input.Type,
		Label: input.Label,
		Placeholder: input.Placeholder,
		Format: input.Format,
		Validation: validation,
		SelectOptions: selectOptions,
		RadioGroupOptions: radioGroupOptions,
		SubComponents: []models.Component{},
	}

	return component
}

func createComponent(input models.SelectedComponentInput) models.SelectedComponent {
	subComponents := []models.Component{}
	component := cascadeCreate(input.Component)	

	for i := range input.Component.SubComponents {
		input := input.Component.SubComponents[i]
		subComponent := cascadeCreate(input)
		subComponents = append(subComponents, subComponent)
	}

	component.SubComponents = subComponents

	selectedComponent := models.SelectedComponent{
		Name: input.Name,
		Component: component,
	}
	return selectedComponent
}

func createSelectedComponents(c *gin.Context) {
	var input models.SelectedComponentInput
	
	if err := c.Bind(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	selectedComponent := createComponent(input)

	fmt.Println(&selectedComponent) 

	models.DB.Create(&selectedComponent)
}

func cascadeUpdate (inputComponent models.ComponentInput, dbComponent models.Component) models.Component {
	dbComponent.Type = inputComponent.Type
	dbComponent.Label = inputComponent.Label
	dbComponent.FormComponentName = inputComponent.FormComponentName
	dbComponent.Placeholder = inputComponent.Placeholder
	dbComponent.Format = inputComponent.Format

	newValidation := []models.Validation{}
	for i := range dbComponent.Validation {
		componentValidation := dbComponent.Validation[i]
		idx := slices.IndexFunc(inputComponent.Validation, func(v models.ValidationInput) bool { return v.ID == componentValidation.ID })
		if (idx != -1) {
			inputValidation := inputComponent.Validation[idx]
			newValidation = append(newValidation, models.Validation{
				ID: inputValidation.ID,
				Param: inputValidation.Param,
				RuleName: inputValidation.RuleName,
				WithParam: inputValidation.WithParam,
				ComponentID: componentValidation.ComponentID,
			})
		} else {
			models.DB.Where("id = ?", componentValidation.ID).Delete(&componentValidation)
		}
    }

	for i := range inputComponent.Validation {
		inputValidation := inputComponent.Validation[i]
		if inputValidation.ID == 0 {
			newValidation = append(newValidation, models.Validation{
				Param: inputValidation.Param,
				RuleName: inputValidation.RuleName,
				WithParam: inputValidation.WithParam,
				ComponentID: dbComponent.ID,
			})
		}
	}

	dbComponent.Validation = newValidation

	newSelectOptions := []models.SelectOptions{}
	for i := range dbComponent.SelectOptions {
		componentSelectOption := dbComponent.SelectOptions[i]
		idx := slices.IndexFunc(inputComponent.SelectOptions, func(v models.SelectOptionsInput) bool { return v.ID == componentSelectOption.ID })
		if (idx != -1) {
			inputSelectOption := inputComponent.SelectOptions[idx]
			newSelectOptions = append(newSelectOptions, models.SelectOptions{
				ID: inputSelectOption.ID,
				Label: inputSelectOption.Label,
				Value: inputSelectOption.Value,
				ComponentID: componentSelectOption.ComponentID,
			})
		} else {
			models.DB.Where("id = ?", componentSelectOption.ID).Delete(&componentSelectOption)
		}
	}

	for i := range inputComponent.SelectOptions {
		selectOption := inputComponent.SelectOptions[i]
		if selectOption.ID == 0 {
			newSelectOptions = append(newSelectOptions, models.SelectOptions{
				Label: selectOption.Label,
				Value: selectOption.Value,
				ComponentID: dbComponent.ID,
			})
		}
	}

	dbComponent.SelectOptions = newSelectOptions

	newRadioGroupOptions := []models.RadioGroupOptions{}
	for i := range dbComponent.RadioGroupOptions {
		componentRadioOption := dbComponent.RadioGroupOptions[i]
		idx := slices.IndexFunc(inputComponent.RadioGroupOptions, func(v models.RadioGroupOptionsInput) bool { return v.ID == componentRadioOption.ID })
		if (idx != -1) {
			radioOption := inputComponent.RadioGroupOptions[idx]
			newRadioGroupOptions = append(newRadioGroupOptions, models.RadioGroupOptions{
				ID: radioOption.ID,
				Label: radioOption.Label,
				Value: radioOption.Value,
				ComponentID: componentRadioOption.ID,
			})
		} else {
			models.DB.Where("id = ?", componentRadioOption.ID).Delete(&componentRadioOption)
		}
	}

	for i := range inputComponent.RadioGroupOptions {
		radioOption := inputComponent.RadioGroupOptions[i]
		if radioOption.ID == 0 {
			newRadioGroupOptions = append(newRadioGroupOptions, models.RadioGroupOptions{
				Label: radioOption.Label,
				Value: radioOption.Value,
				ComponentID: dbComponent.ID,
			})
		}
	}
	dbComponent.RadioGroupOptions = newRadioGroupOptions
	
	return dbComponent
}

func updateSelectedComponents(c *gin.Context) {
	var inputSelectedComponent models.SelectedComponentInput
	var selectedComponent models.SelectedComponent

	if err := models.DB.Where("id = ?", c.Param("id")).Preload("Component." + clause.Associations).Preload("Component.SubComponents." + clause.Associations).First(&selectedComponent).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Component not found!"})
		return
	}

	if err := c.Bind(&inputSelectedComponent); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if inputSelectedComponent.Name != selectedComponent.Name {
		selectedComponent.Name = inputSelectedComponent.Name
	}

	newSubComponents := []models.Component{}
	for i := range selectedComponent.Component.SubComponents {
		subComponent := selectedComponent.Component.SubComponents[i]
		idx := slices.IndexFunc(inputSelectedComponent.Component.SubComponents, func(c models.ComponentInput) bool { return c.ID == subComponent.ID })
		if (idx != -1) {
			newSubComponents = append(newSubComponents, cascadeUpdate(inputSelectedComponent.Component.SubComponents[idx], selectedComponent.Component.SubComponents[i]))
		} else {
			models.DB.Where("id = ?", subComponent.ID).Delete(&subComponent)
		}
	}

	for i := range inputSelectedComponent.Component.SubComponents {
		inputSubComponent := inputSelectedComponent.Component.SubComponents[i]
		if inputSubComponent.ID == 0 {
			newSubComponent := cascadeCreate(inputSubComponent)
			newSubComponent.ComponentID = inputSelectedComponent.Component.ID
			newSubComponents = append(newSubComponents, newSubComponent)
		}
	}

	updatedComponent := cascadeUpdate(inputSelectedComponent.Component, selectedComponent.Component)
	updatedComponent.SubComponents = newSubComponents
	selectedComponent.Component = updatedComponent

	models.DB.Save(&selectedComponent)
   
	c.JSON(http.StatusOK, gin.H{"data": selectedComponent})
}

func main() {
	r := gin.Default()

	models.ConnectDatabase()

	r.GET("/components", getSelectedComponents)
	r.POST("/components", createSelectedComponents)
	r.DELETE("/components/:id", deleteSelectedComponent)
	r.PATCH("/components/:id", updateSelectedComponents)

	r.Run()
}