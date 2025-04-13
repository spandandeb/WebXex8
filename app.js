// Main Application Module
var app = angular.module('myApp', []);

// A. DATA BINDING CONTROLLER
app.controller('DataBindingController', function($scope) {
    // Two-way data binding
    $scope.twoWayValue = "Hello AngularJS";
    
    // One-way data binding
    $scope.currentTime = new Date().toLocaleTimeString();
    $scope.updateTime = function() {
        $scope.currentTime = new Date().toLocaleTimeString();
    };
    
    // One-way data binding with ng-bind
    $scope.oneWayValue = "Initial Value";
    $scope.changeValue = function() {
        $scope.oneWayValue = "Updated Value: " + new Date().toLocaleTimeString();
    };
});

// B. AUTHENTICATION CONTROLLER
app.controller('AuthController', function($scope) {
    // Initialize variables
    $scope.credentials = {
        username: '',
        password: ''
    };
    $scope.loginSuccess = false;
    $scope.loginError = false;
    $scope.isLoggedIn = false;
    
    // Valid credentials (hardcoded for demo)
    var validCredentials = {
        username: 'spandandeb',
        password: '123456'
    };
    
    // Login function
    $scope.login = function() {
        if ($scope.credentials.username === validCredentials.username && 
            $scope.credentials.password === validCredentials.password) {
            $scope.loginSuccess = true;
            $scope.loginError = false;
            $scope.isLoggedIn = true;
        } else {
            $scope.loginSuccess = false;
            $scope.loginError = true;
            $scope.isLoggedIn = false;
        }
    };
    
    // Logout function
    $scope.logout = function() {
        $scope.isLoggedIn = false;
        $scope.loginSuccess = false;
    };
});

// C. BOOK CONTROLLER AND CUSTOM FILTER
app.controller('BookController', function($scope) {
    // Sample book data
    $scope.books = [
        { title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Fiction' },
        { title: '1984', author: 'George Orwell', genre: 'Dystopian' },
        { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Classic' },
        { title: 'Pride and Prejudice', author: 'Jane Austen', genre: 'Romance' },
        { title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy' },
        { title: 'Brave New World', author: 'Aldous Huxley', genre: 'Dystopian' }
    ];
    
    // Default search settings
    $scope.searchQuery = '';
    $scope.searchType = 'all';
});

// Custom filter implementation
app.filter('bookFilter', function() {
    return function(books, query, searchType) {
        if (!query) {
            return books;
        }
        
        query = query.toLowerCase();
        var result = [];
        
        for (var i = 0; i < books.length; i++) {
            var book = books[i];
            
            if (searchType === 'all') {
                if (book.title.toLowerCase().indexOf(query) !== -1 || 
                    book.author.toLowerCase().indexOf(query) !== -1 || 
                    book.genre.toLowerCase().indexOf(query) !== -1) {
                    result.push(book);
                }
            } else if (searchType === 'title' && book.title.toLowerCase().indexOf(query) !== -1) {
                result.push(book);
            } else if (searchType === 'author' && book.author.toLowerCase().indexOf(query) !== -1) {
                result.push(book);
            } else if (searchType === 'genre' && book.genre.toLowerCase().indexOf(query) !== -1) {
                result.push(book);
            }
        }
        
        return result;
    };
});

// D. AUTH SERVICE IMPLEMENTATION
app.service('AuthService', function() {
    var currentUser = null;
    
    // Sample user database
    var users = [
        { username: 'user1', password: 'pass1', role: 'User' },
        { username: 'admin1', password: 'admin123', role: 'Admin' }
    ];
    
    return {
        // Authenticate user
        login: function(username, password) {
            // Find matching user
            for (var i = 0; i < users.length; i++) {
                if (users[i].username === username && users[i].password === password) {
                    currentUser = {
                        username: users[i].username,
                        role: users[i].role
                    };
                    return { success: true };
                }
            }
            return { success: false, message: 'Invalid username or password' };
        },
        
        // Logout user
        logout: function() {
            currentUser = null;
        },
        
        // Check if user is authenticated
        isAuthenticated: function() {
            return currentUser !== null;
        },
        
        // Get current user info
        getCurrentUser: function() {
            return currentUser;
        }
    };
});

// Controller that uses the Auth Service
app.controller('ServiceAuthController', function($scope, AuthService) {
    $scope.userCredentials = {
        username: '',
        password: ''
    };
    $scope.authError = null;
    
    // Login function using service
    $scope.login = function() {
        var result = AuthService.login($scope.userCredentials.username, $scope.userCredentials.password);
        if (!result.success) {
            $scope.authError = result.message;
        } else {
            $scope.authError = null;
        }
    };
    
    // Check authentication status
    $scope.isAuthenticated = function() {
        return AuthService.isAuthenticated();
    };
    
    // Get current user
    $scope.currentUser = function() {
        return AuthService.getCurrentUser();
    };
    
    // Logout function
    $scope.logout = function() {
        AuthService.logout();
    };
});