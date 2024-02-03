// models/setup.go

package models

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {

        database, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})

        if err != nil {
                panic("Failed to connect to database!")
        }

        err = database.AutoMigrate(&SelectedComponent{})
        if err != nil {
                return
        }
        err =database.AutoMigrate(&Component{})
        if err != nil {
                return
        }
        err =database.AutoMigrate(&Validation{})
        if err != nil {
                return
        }
        err =database.AutoMigrate(&RadioGroupOptions{})
        if err != nil {
                return
        }
        err =database.AutoMigrate(&SelectOptions{})
        if err != nil {
                return
        }

        DB = database
}